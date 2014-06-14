$ns("fss");

var async = require("async");

$import("fss.db.DbConnection");
$import("fss.model.Channel");
$import("fss.biz.ChannelManager");

fss.Server = function()
{
    var me = $extend(mx.Component);
    me.autoInit = false;
    var base = {};
    
    me.channelManager = null;
    me.status = null;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.status = "initializing";
        mx.logger.info("FeedStore server is now initializing...");
        
        // Connect to MongoDB
        fss.db.DbConnection.connect();
        
        // Initialize managers
        me.channelManager = new fss.biz.ChannelManager();
    };
    
    me.start = function(p_callback)
    {
        me.status = "starting";
        mx.logger.info("FeedStore server is now starting...");
        
        async.series([
            me.channelManager.load
        ], function(p_err, p_results)
        {
            if (isEmpty(p_err))
            {
                me.status = "running";
                mx.logger.info("FeedStore server status is now switch to RUNNING.");
            }
            else
            {
                me.status = "error";
                mx.logger.error(p_err);
            }
            
            p_callback(p_err, p_results);
        });
    };
    
    return me.endOfClass(arguments);
};
fss.server = new fss.Server();
module.exports = fss.Server;