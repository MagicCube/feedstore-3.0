$ns("fs.view");

$include("fs.res.PostDetailView.css");

fs.view.PostDetailView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "PostDetailView";
    var base = {};
    
    me.post = null;
    
    me.onshow = null;
    me.onhide = null;
    
    var _$title = null;
    var _$content = null;
    var _$publishTime = null;
    var _$channel = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        var $post = $("<div id=post>"); 
        
        var $header = $("<div id=header>");
        _$title = $("<h1>");
        $header.append(_$title);
        $header.append("<hr>");
        _$publishTime = $("<div id=publishTime>");
        $header.append(_$publishTime);
        _$channel = $("<div id=channel>");
        $header.append(_$channel);
        $post.append($header);
        
        _$content = $("<div id=content>");
        $post.append(_$content);
        
        me.$container.append($post);
        
        me.$container.on("click", _onclick);
    };
    
    me.setPost = function(p_post)
    {
        me.post = p_post;
        _$title.text(p_post.title);
        _$content.html(p_post.content);
        _$channel.text(fs.app.subscriptionAgent.channels[p_post.cid].title);
        _$publishTime.text($format(p_post.publishTime, "M月d日 HH:mm"));
    };
    
    me.showPost = function(p_post)
    {
        me.setPost(p_post);
        me.show();
    };

    
    
    me.show = function()
    {
        me.trigger("show");
        me.setFrame({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        });
        me.css({
            scale: 1,
            position: "fixed",
            zIndex: 999,
            opacity: 0,
            y: 400
        });
        
        $(document.body).append(me.$container);
        me.$container.transit({
            opacity: 1,
            y: 0
        }, "fast");
    };
    
    me.hide = function()
    {
        me.trigger("hide");
        me.$container.transit({
            opacity: 0
        }, "fast", function()
        {
            me.$container.detach();
        });
    };
    
    function _onclick(e)
    {
        if (e.target === me.$container[0])
        {
            me.hide();
        }
    }

    return me.endOfClass(arguments);
};
fs.view.PostDetailView.className = "fs.view.PostDetailView";
