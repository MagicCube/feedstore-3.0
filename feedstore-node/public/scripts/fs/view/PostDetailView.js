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
    
    var _$post = null;
    var _$postBackup = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        _$post = _createPost();
        me.$container.append(_$post);
        
        _$postBackup = _createPost();
        _$postBackup.css({
            x: 1000
        });
        
        me.$container.on("click", _onclick);
    };
    
    me.setPost = function(p_post)
    {
        me.post = p_post;
        _renderPost(p_post, _$post);
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
    
    
    
    
    function _renderPost(p_post, $p_post)
    {
        $p_post.find("h1").text(p_post.title);
        $p_post.find("#content").html(p_post.content);
        $p_post.find("#content").find("a").attr("target", "_blank");
        $p_post.find("#channel").text(fs.biz.ChannelAgent.channels[p_post.channelId].title);
        $p_post.find("#publishTime").text($format(p_post.publishTime, "M月d日 HH:mm"));
    }
    
    function _createPost()
    {
        var $post = $("<div id=post>"); 
        
        var $header = $("<div id=header>");
        $header.append("<h1>");
        $header.append("<hr>");
        $header.append("<div id=publishTime>");
        $header.append("<div id=channel>");
        $post.append($header);

        $post.append("<div id=content>");
        
        return $post;
    }
    
    
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
