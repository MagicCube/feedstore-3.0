$ns("fss.biz");

fss.biz.ChannelManager = function()
{
    var me = $extend(mx.Component);
    var base = {};
    
    me.channels = null;
    
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
            if (p_err !== null)
            {
                mx.logger.error("Fail to load channels.");
                if (isFunction(p_callback))
                {
                    p_callback(p_err);
                }
            }
            else
            {
                if (p_results.length === 0)
                {
                    mx.logger.warn("No channel found in the database.");
                    me.createInitialChannels(function(p_err, p_results)
                    {
                        if (p_err === null)
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
                    if (isFunction(p_callback))
                    {
                        p_callback(null, p_results);
                    }
                }
            }
        });
    };
    
    
    me.createInitialChannels = function(p_callback)
    {
        mx.logger.info("ChannelManager is now creating the initial channels described in '/init/channels.json' file...");
        var channelUrls = require("../../../init/channels.json");
        var channels = channelUrls.map(function(p_url, p_index)
        {
            var channel = new fs.model.Channel({
                cid: p_url,
                title: "Channel#" + (p_index + 1),
                feedUrl: p_url,
                linkUrl: p_url,
                lastPublishTime: null,
                lastUpdateTime: null,
                lastUpdateStatus: -1,
                lastSuccessfulUpdateTime: null
            });
            return channel;
        });
        fs.model.Channel.create(channels, function(p_err, p_results)
        {
            if (p_err === null)
            {
                mx.logger.info("Successfully create " + channels.length + " channels.");
                if (isFunction(p_callback))
                {
                    p_callback(null, p_results);
                }
            }
            else
            {
                mx.logger.info("Fail to create channels.");
                if (isFunction(p_callback))
                {
                    p_callback(p_err);
                }
            }
        });
    };
    
    return me.endOfClass(arguments);
};
module.exports = fss.biz.ChannelManager;