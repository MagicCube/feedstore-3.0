$ns("fs.biz");


fs.biz.PostAgent = function()
{
    var me = $extend(MXComponent);
    var base = {};

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };

    me.queryPosts = function(p_options)
    {
        var options = $.extend({
            pageIndex: 0,
            pageSize: 50
        }, p_options);
        if (options.pageIndex == 0)
        {
            options.selectChannels = true;
        }
        var def = $.ajax({
            url: fs.app.getServiceUrl("/posts/"),
            data: options
        });
        def.done(function(p_results)
        {
            fs.app.channelAgent.setChannels(p_results.channels);
        });
        return def;
    };

    return me.endOfClass(arguments);
};
fs.biz.PostAgent.className = "fs.biz.PostAgent";
