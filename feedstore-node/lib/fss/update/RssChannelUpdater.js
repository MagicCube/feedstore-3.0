$ns("fss.update");

var async = require("async");

var request = require('request');
var Iconv = require('iconv').Iconv;
var FeedParser = require("feedparser");

var urlUtil = require('url');
var http = require('http');
var cheerio = require("cheerio");
var sizeOf = require('image-size');

/*
 * Channel.lastUpdateStatus
 *    0 - Not updated yet
 *  200 - OK
 *  403 - Forbidden
 *  404 - Not found
 *  500 - Server error
 * -500 - Network exception
 * -601 - Encoding error
 * -602 - Parser error
 * -603 - Parser error  
 */

fss.update.RssChannelUpdater = function()
{
    var me = $extend(mx.Component);
    var base = {};
    
    me.ignoreError = false;
    me.hasError = false;
    
    me.channel = null;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };
    
    me.update = function(p_callback)
    {
        if (isEmpty(me.channel))
        {
            if (isFunction(p_callback))
            {
                p_callback(new Error("RssUpdater's channel can not be null when updating."));
            }
            return;
        }
        
        var beginTime = Date.now();
        _fetch(function(p_error, p_posts)
        {
            if (isEmpty(p_error))
            {
                me.channel.lastSuccessfulUpdateTime = new Date();
                mx.logger.info("Successfully updated Channel <" + _getChannelTitle() + "> with " + p_posts.length + " posts in " + ((Date.now() - beginTime) / 1000) + " seconds.");
                if (isFunction(p_callback))
                {
                    p_callback(null, p_posts);
                }
            }
            else
            {
                if (isFunction(p_callback))
                {
                    if (!me.ignoreError)
                    {
                        mx.logger.error("Failed to updated Channel <" + _getChannelTitle() + "> with error code <" + me.channel.lastUpdateStatus + ">: " + (notEmpty(p_error) ? p_error.message : ""));
                        p_callback(p_error);
                    }
                    else
                    {
                        // Ignore errors and return nothing.
                        mx.logger.warn("Failed to updated Channel <" + _getChannelTitle() + "> with error code <" + me.channel.lastUpdateStatus + "> which will be ignored: " + (notEmpty(p_error) ? p_error.message : ""));
                        p_callback(null, null);
                    }
                }
            }
        });
    };
    
    function _fetch(p_callback)
    {
        me.channel.lastUpdateTime = new Date();
        me.hasError = false;
        
        var url = me.channel.feedUrl;
        //mx.logger.debug("Updating Channel <" + _getChannelTitle() + ">...");
        var req = request(url, {timeout: fss.settings.update.timeout, pool: true});
        req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
           .setHeader('accept', 'text/html,application/xhtml+xml');
        
        req.on('error', function(p_err)
        {
            if (me.hasError)
            {
                return;
            }
            me.hasError = true;
            
            me.channel.lastUpdateStatus = -500;
            p_callback(p_err);
        });
        
        req.on('response', function(res)
        {
            var stream = this;

            me.channel.lastUpdateStatus = res.statusCode;
            if (res.statusCode != 200)
            {
                // If server returns with error code.
                if (me.hasError)
                {
                    return;
                }
                me.hasError = true;
                
                p_callback(new Error("Bad status code returned (" + url + ")."));
                return;
            }
            
            
            // Encoding
            var charset = _getParams(res.headers['content-type'] || '').charset;
            if (isEmptyString(charset))
            {
                charset = fss.settings.update.defaultEncoding;
            }
            if (!/utf-*8/i.test(charset))
            {
                iconv = new Iconv(charset, 'utf-8');
                mx.logger.debug('Converting from charset " + charset + " to utf-8.');
                iconv.on('error', function(p_err)
                {
                    if (me.hasError)
                    {
                        return;
                    }
                    me.hasError = true;
                    
                    me.channel.lastUpdateStatus = -601;
                    p_callback(p_err);
                });
                stream = this.pipe(iconv);
            }
            
            // Parsing
            var feedparser = new FeedParser();
            stream.pipe(feedparser);
            
            var posts = [];
            feedparser.on("error", function(p_err)
            {
                if (me.hasError)
                {
                    return;
                }
                me.hasError = true;
                
                me.channel.lastUpdateStatus = -602;
                p_callback(p_err);
            });
            feedparser.on("readable", function()
            {
                var post = null;
                while (post = this.read())
                {
                    if (_isNew(post))
                    {                        
                        if (me.channel.cid.indexOf("evolife.cn") != -1)
                        {
                            post.pubDate = post.pubDate.addHours(-14);
                            post.pubdate = post.pubDate;
                        }

                        post.bigContent = _getContent(post);
                        post.image = _getImage(post);
                        
                        posts.add(post);
                    }
                }
            });
            feedparser.on("end", function(p_err)
            {
                if (isEmpty(p_err) && !me.hasError)
                {
                    var imgTasks = posts.reduce(function(p_imgTasks, p_currentPost)
                    {
                        if (p_currentPost.image != null)
                        {
                            p_imgTasks.add(function(p_taskCallback)
                            {
                                _tryToGetImageSize(p_currentPost, p_taskCallback);
                            });
                        }
                        return p_imgTasks;
                    }, []);
                    var hasCalledBack = false;
                    async.parallel(imgTasks, function()
                    {
                        if (!hasCalledBack)
                        {
                            p_callback(null, posts);
                        }
                    });
                }
                else
                {
                    if (me.hasError)
                    {
                        return;
                    }
                    me.hasError = true;
                    
                    me.channel.lastUpdateStatus = -603;
                    p_callback(p_err);
                }
            });
        });
    }
    
    function _isNew(p_post)
    {
        return me.channel.lastUpdateStatus === 0 || me.channel.lastPublishTime < p_post.pubDate;
    }
    
    function _getContent(p_post)
    {
        var content = "";
        if (notEmpty(p_post.content))
        {
            content = p_post.content;
        }
        else if (notEmpty(p_post.description) && content.length < p_post.description.length)
        {
            content = p_post.description;
        }
        return content;
    }
    
    function _getImage(post)
    {
        var img = null;
        var $dom = cheerio.load(post.bigContent);
        var $img = $dom("img");
        if ($img.length > 0)
        {
            var url = $img.eq(0).attr("src");
            if (notEmpty(url) && !isEmptyString(url) && !url.startsWith("http://geekpark-img.qiniudn.com/uploads/anonymous_avatar"))
            {
                img = {
                    url: url
                };
            }
            else if ($img.length > 1)
            {
                url = $img.eq($img.length - 1).attr("src");
                img = {
                    url: url
                };
            }
        }
        return img;
    }

    function _getParams(str)
    {
        var params = str.split(';').reduce(function(params, param)
        {
            var parts = param.split('=').map(function(part)
            {
                return part.trim();
            });
            if (parts.length === 2)
            {
                params[parts[0]] = parts[1];
            }
            return params;
        }, {});
        return params;
    }
    
    function _getChannelTitle()
    {
        return me.channel.title.startsWith("Channel#") ? me.channel.cid : me.channel.title;
    }
    
    
    
    function _tryToGetImageSize(p_post, p_callback)
    {
        var url = p_post.image.url;
        var req = request(url, {timeout: fss.settings.update.timeout, pool: true});
        var chunks = [];
        req.on('data', function(chunk)
        {
            chunks.push(chunk);
            var buffer = Buffer.concat(chunks);
            var size = null;
            try
            {
                size = sizeOf(buffer);
                if (isObject(size) && size.width > 0 && size.height > 0)
                {
                    req.abort();
                    if (isFunction(p_callback))
                    {
                        if (size.width > 100 && size.height > 50)
                        {
                            p_post.image.width = size.width;
                            p_post.image.height = size.height;
                        }
                        else
                        {
                            p_post.image = null;
                        }
                        p_callback(null, 1);
                        p_callback = null;
                    }
                }
            }
            catch (e)
            {
                
            }
        });
        req.on('end', function()
        {
            if (!isFunction(p_callback))
            {
                return;
            }
            var buffer = Buffer.concat(chunks);
            var size = null;
            try
            {
                size = sizeOf(buffer);
                if (isObject(size) && size.width > 0 && size.height > 0)
                {
                    req.abort();
                    if (isFunction(p_callback))
                    {
                        if (size.width > 100 && size.height > 50)
                        {
                            p_post.image.width = size.width;
                            p_post.image.height = size.height;
                        }
                        else
                        {
                            p_post.image = null;
                        }
                        p_callback(null, 1);
                        p_callback = null;
                    }
                }
            }
            catch (e)
            {
                if (isFunction(p_callback))
                {
                    p_callback(null, 0);
                    p_callback = null;
                }
            }
        });
        req.once('error', function()
        {
            if (isFunction(p_callback))
            {
                p_callback(null, 0);
                p_callback = null;
            }
        });
    }
    
    return me.endOfClass(arguments);
};