$ns("fs.biz");


fs.biz.ChannelAgentClass = function()
{
    var me = $extend(MXComponent);
    var base = {};
    
    me.channels = [];

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };
    
    me.addChannel = function(p_channel)
    {
        me.channels.add(p_channel);
        me.channels[p_channel._id] = p_channel;
        me.channels[p_channel.cid] = p_channel;
    };
    
    me.addChannels = function(p_channels)
    {
        p_channels.forEach(function(p_channel)
        {
            me.addChannel(p_channel);
        });
    };
    
    me.removeAllChannels = function()
    {
        me.channels.clear();
        me.channels = [];
    };

    me.setChannels = function(p_channels)
    {
        me.removeAllChannels();
        me.addChannels(p_channels);
    };

    return me.endOfClass(arguments);
};
fs.biz.ChannelAgentClass.className = "fs.biz.ChannelAgentClass";
fs.biz.ChannelAgent = new fs.biz.ChannelAgentClass();
