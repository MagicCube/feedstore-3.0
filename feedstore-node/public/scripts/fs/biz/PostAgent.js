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
        return $.ajax({
            url: fs.app.getServiceUrl("/posts/"),
            data: options
        });
    };

    return me.endOfClass(arguments);
};
fs.biz.PostAgent.className = "fs.biz.PostAgent";
