$ns("fss.biz");

var async = require("async");

$import("fss.update.RssChannelUpdater");

fss.biz.ChannelManager = function()
{
    var me = $extend(mx.Component);
    var base = {};
    
    me.channels = null;
    me.updaters = null;
    
    var _needUpdate = false;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };
    
    me.load = function(p_callback)
    {
        mx.logger.info("Loading channels...");
        fs.model.Channel.find({}, function(p_err, p_results)
        {
            if (isEmpty(p_err))
            {
                if (p_results.length === 0)
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
                    mx.logger.info("%d channels were loaded from the database.", p_results.length);
                    me.channels = p_results;
                    _createUpdaters();
                    if (isFunction(p_callback))
                    {
                        p_callback(null, p_results);
                    }
                }
            }
            else
            {
                mx.logger.error("Fail to load channels.");
                if (isFunction(p_callback))
                {
                    p_callback(p_err);
                }
            }
        });
    };
    
    
    me.createInitialChannels = function(p_callback)
    {
        mx.logger.info("ChannelManager is now creating the initial channels described in '/init/channels.json' file...");
        var channelUrls = require($mappath("~/init/channels.json"));
        var channels = channelUrls.map(function(p_url, p_index)
        {
            var channel = new fs.model.Channel({
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
        
        fs.model.Channel.create(channels, function(p_err, p_results)
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
        mx.logger.info("%s ChannelUpdaters were created accordingly.", me.updaters.length);
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
                mx.logger.info("******************************** Finished Sheduled Update ********************************");
                
                var seconds = (fss.settings.update.interval / 1000);
                if (seconds < 60)
                {
                    mx.logger.info("The next shift will start in %d seconds.", seconds);
                }
                else
                {
                    mx.logger.info("The next shift will start in %d minutes.", seconds / 60);
                }
                
                console.log("\n");
                
                if (_needUpdate)
                {
                    setTimeout(_batchUpdate, fss.settings.update.interval);
                }
            }
        });
    }
    
    return me.endOfClass(arguments);
};