$ns("fss");

$import("fss.db.DbConnection");
$import("fss.model.Channel");
$import("fss.biz.ChannelManager");

fss.Application = function()
{
    var me = $extend(mx.Component);
    me.autoInit = false;
    var base = {};
    
    me.channelManager = null;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        // Connect to MongoDB
        fss.db.DbConnection.connect();
        
        // Initialize managers
        me.channelManager = new fss.biz.ChannelManager();
    };
    
    me.run = function()
    {
        me.channelManager.load();
    };
    
    return me.endOfClass(arguments);
};
fss.app = new fss.Application();
module.exports = fss.Application;