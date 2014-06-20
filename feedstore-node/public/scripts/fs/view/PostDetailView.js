$ns("fs.view");

$include("fs.res.PostDetailView.css");

fs.view.PostDetailView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "PostDetailView";
    var base = {};
    
    me.post = null;
    
    var _$title = null;
    var _$content = null;
    var _$publishTime = null;
    var _$channel = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        var $header = $("<div id=header>");
        _$title = $("<h1>");
        $header.append(_$title);
        $header.append("<hr>");
        _$publishTime = $("<div id=publishTime>");
        $header.append(_$publishTime);
        _$channel = $("<div id=channel>");
        $header.append(_$channel);
        me.$container.append($header);
        
        _$content = $("<div id=content>");
        me.$container.append(_$content);
    };
    
    me.setPost = function(p_post)
    {
        me.post = p_post;
        _$title.text(p_post.title);
        _$content.html(p_post.content);
        _$channel.text(fs.app.subscriptionAgent.channels[p_post.cid].title);
        _$publishTime.text($format(p_post.publishTime, "M月d日 HH:mm"));
    };


    return me.endOfClass(arguments);
};
fs.view.PostDetailView.className = "fs.view.PostDetailView";
