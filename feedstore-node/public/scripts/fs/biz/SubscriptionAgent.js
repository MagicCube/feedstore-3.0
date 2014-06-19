$ns("fs.biz");


fs.biz.SubscriptionAgent = function()
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

    me.load = function()
    {
        var def = $.Deferred();
        $.ajax({
            url: fs.app.getServiceUrl("/subscriptions/")
        }).done(function(p_results)
        {
            p_results.forEach(function(p_channel)
            {
                me.addChannel(p_channel);
            });
            def.resolve();
        });
        return def;
    };

    return me.endOfClass(arguments);
};
fs.biz.SubscriptionAgent.className = "fs.biz.SubscriptionAgent";
