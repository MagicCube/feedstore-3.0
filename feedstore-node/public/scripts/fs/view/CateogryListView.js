$ns("fs.view");

$include("fs.res.CateogryListView.css");

fs.view.CateogryListView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "CateogryListView";
    var base = {};

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.$container.append("<ul><li>全部</li><li>科技</li><li>设计</li><li>开发</li><li>购物</li></ul>");
    };


    return me.endOfClass(arguments);
};
fs.view.CateogryListView.className = "fs.view.CateogryListView";
