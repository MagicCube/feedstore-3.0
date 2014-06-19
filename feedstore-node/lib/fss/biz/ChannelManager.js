$ns("fss.biz");

var async = require("async");

$import("fss.model.Channel");
$import("fss.update.RssChannelUpdater");

fss.biz.ChannelManager = function()
{
    var me = $extend(mx.Component);
    var base = {};
    
    me.channels = [];
    me.updaters = null;
    
    var _needUpdate = false;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };
    
    me.load = function(p_callback)
    {
        fss.db.DbConnection.connect();
        mx.logger.info("Loading channels...");
        fss.model.Channel.find({}, function(p_err, p_results)
        {
            if (isEmpty(p_err))
            {
                if (p_results === null || p_results.length === 0)
                {
                    mx.logger.warn("No channel found in the database.");
                    me.createInitialChannels(function(p_err, p_results)
                    {
                        if (isEmpty(p_err))
                        {
                            // 重新加载
                            mx.logger.info("ChannelManager is about to reload channels.");
                            me.load(p_callback);
                        }
                        else
                        {
                            if (isFunction(p_callback))
                            {
                                p_callback(p_err);
                            }
                        }
                    });
                }
                else
                {
                    fss.db.DbConnection.disconnect();
                    
                    mx.logger.info(p_results.length + " channels were loaded from the database.");
                    p_results.forEach(function(p_channel)
                    {
                        me.addChannel(p_channel);
                    });
                    _createUpdaters();
                    if (isFunction(p_callback))
                    {
                        p_callback(null, p_results);
                    }
                }
            }
            else
            {
                fss.db.DbConnection.disconnect();
                mx.logger.error("Fail to load channels.");
                if (isFunction(p_callback))
                {
                    p_callback(p_err);
                }
            }
        });
    };
    
    me.addChannel = function(p_channel)
    {
        me.channels.add(p_channel);
        me.channels[p_channel.cid] = p_channel;
        me.channels[p_channel.id.toString()] = p_channel;
    };
    
    
    me.createInitialChannels = function(p_callback)
    {
        mx.logger.info("ChannelManager is now creating the initial channels described in '/init/channels.json' file...");
        var channelUrls = require($mappath("~/init/channels.json"));
        var channels = channelUrls.map(function(p_url, p_index)
        {
            var channel = new fss.model.Channel({
                cid: p_url,
                title: "Channel#" + (p_index + 1),
                description: null,
                feedUrl: p_url,
                linkUrl: p_url,
                lastPublishTime: null,
                lastUpdateTime: null,
                lastUpdateStatus: 0,
                lastSuccessfulUpdateTime: null
            });
            return channel;
        });
        
        fss.model.Channel.create(channels, function(p_err, p_results)
        {
            if (isEmpty(p_err))
            {
                mx.logger.info("Successfully create " + channels.length + " channels.");
                p_callback(null, p_results);
            }
            else
            {
                mx.logger.info("Fail to create channels.");
                p_callback(p_err);
            }
        });
    };
    
    me.startSheduledUpdate = function()
    {
        _needUpdate = true;
        setTimeout(function()
        {
            if (_needUpdate)
            {
                _batchUpdate();
            }
        }, 500);
    };
    
    
    function _createUpdaters()
    {
        me.updaters = me.channels.map(function(p_channel)
        {
            var updater = new fss.update.RssChannelUpdater({
                channel: p_channel,
                ignoreError: true
            });
            return updater;
        });
        mx.logger.info(me.updaters.length + " ChannelUpdaters were created accordingly.");
    }
    
    function _batchUpdate()
    {
        if (!_needUpdate) return;
        
        console.log("\n");
        mx.logger.info("******************************** Start Sheduled Update ********************************");
        
        var updates = me.updaters.map(function(p_updater)
        {
            return p_updater.update;
        });
        async.parallelLimit(updates, fss.settings.update.parallelLimit, function(p_error, p_results)
        {            
            if (isEmpty(p_error) && notEmpty(p_results) && p_results.length == me.channels.length)
            {
                mx.logger.info("****************************** Finished Sheduled Update ******************************");
                
                _batchUpdate_callback(p_results);
                                
                var seconds = (fss.settings.update.interval / 1000);
                if (seconds < 60)
                {
                    mx.logger.info("The next shift will start in " + seconds + " seconds.");
                }
                else
                {
                    mx.logger.info("The next shift will start in " + (seconds / 60) + " minutes.");
                }
                
                console.log("\n");
                
                if (_needUpdate)
                {
                    setTimeout(_batchUpdate, fss.settings.update.interval);
                }
            }
        });
    }
    
    function _batchUpdate_callback(p_channels)
    {
        fss.db.DbConnection.connect();
        
        p_channels.forEach(function(p_rawPosts, p_channelIndex)
        {
            if (isEmpty(p_rawPosts) || p_rawPosts.length === 0)
            {
                return;
            }
            
            p_rawPosts.sort(function(a, b)
            {
                return b.pubDate - a.pubDate;
            });
            
            var cid = p_rawPosts[0].meta.link;
            var channel = me.channels[p_channelIndex];
                        
            _updatePosts(p_rawPosts, channel);
            _updateChannel(p_rawPosts[0].meta, channel, p_rawPosts[0].pubDate);
        });
    }
    
    
    
    
    
    
    
    function _updatePosts(p_rawPosts, p_channel, p_callback)
    {
        var newRawPosts = null;
        if (p_channel.lastUpdateStatus === 0)
        {
            newRawPosts = p_rawPosts;
        }
        else
        {
            newRawPosts = p_rawPosts.filter(function(p_rawPost)
            {
                return (p_channel.lastPublishTime < p_rawPost.pubDate);
            });
        }

        if (newRawPosts.length > 0)
        {
            fss.server.postManager.savePosts(newRawPosts, p_channel, p_callback);
        }
        else
        {
            if (isFunction(p_callback))
            {
                p_callback(null, []);
            }
        }
    }
    
    function _updateChannel(p_meta, p_channel, p_lastPublishTime, p_callback)
    {
        p_channel.title = p_meta.title;
        p_channel.description = p_meta.description ? p_meta.description : null;
        p_channel.copyright = p_meta.copyright ? p_meta.copyright : null;
        p_channel.linkUrl = p_meta.link ? p_meta.link : me.channel.feedUrl;
        p_channel.lastPublishTime = p_lastPublishTime;
        p_channel.save(p_callback);
    }
    
    return me.endOfClass(arguments);
};