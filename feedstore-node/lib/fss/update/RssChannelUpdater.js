$ns("fss.update");

var request = require('request');
var Iconv = require('iconv').Iconv;
var FeedParser = require("feedparser");

/*
 * Channel.lastUpdateStatus
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
                mx.logger.info("Successfully updated Channel <" + me.channel.cid + "> with " + p_posts.length + " posts in " + ((Date.now() - beginTime) / 1000) + " seconds.");
                if (p_posts.length > 0)
                {
                    _updateChannel(p_posts[0].meta);
                }
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
                        mx.logger.error("Failed to updated Channel <" + me.channel.cid + "> with error code <" + me.channel.lastUpdateStatus + ">: " + (notEmpty(p_error) ? p_error.message : ""));
                        p_callback(p_error);
                    }
                    else
                    {
                        // Ignore errors and return nothing.
                        mx.logger.warn("Failed to updated Channel <" + me.channel.cid + "> with error code <" + me.channel.lastUpdateStatus + "> which will be ignored: " + (notEmpty(p_error) ? p_error.message : ""));
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
        //mx.logger.debug("Updating Channel <" + me.channel.cid + ">...");
        var req = request(url, {timeout: fss.settings.update.timeout, pool: false});
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
                    posts.add(post);
                }
            });
            feedparser.on("end", function(p_err)
            {
                if (isEmpty(p_err) && !me.hasError)
                {
                    p_callback(null, posts);
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
    
    function _updateChannel(p_meta)
    {
        me.channel.title = p_meta.title;
        me.channel.description = p_meta.description ? p_meta.description : null;
        me.channel.copyright = p_meta.copyright ? p_meta.copyright : null;
        me.channel.linkUrl = p_meta.link ? p_meta.link : me.channel.feedUrl;
        me.channel.lastPublishTime = p_meta.date;
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
    
    return me.endOfClass(arguments);
};