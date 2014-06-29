$ns("fs.biz");


fs.biz.SubscriptionAgent = function()
{
    var me = $extend(MXComponent);
    var base = {};

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };

    me.load = function()
    {
        var def = $.Deferred();
        $.ajax({
            url: fs.app.getServiceUrl("/subscriptions/")
        }).done(function(p_results)
        {
            def.resolve();
        });
        return def;
    };

    return me.endOfClass(arguments);
};
fs.biz.SubscriptionAgent.className = "fs.biz.SubscriptionAgent";
