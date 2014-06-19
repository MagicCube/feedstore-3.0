$ns("fs.view");

$include("fs.res.PostListView.css");

fs.view.PostListView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "PostListView";
    var base = {};
    
    me.cols = 0;
    me.colIndex = 0;
    me.pageIndex = 0;
    me.pageSize = 50;
    
    var _$cols = [];
    var _$colgroup = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };

    me.load = function()
    {        
        me.pageIndex = -1;
        me.colIndex = -1;
        _onresize();
        
        me.clear();
        
        _nextPage();
    };
    
    function _onresize()
    {
        me.frame.width = me.$container.width();
        me.frame.height = me.$container.height();
        
        if (me.cols === 0)
        {
            me.cols = Math.floor(me.frame.width / (224 + 12));
            _$colgroup = $("<div class=colgroup>");
            for (var i = 0; i < me.cols; i++)
            {
                var $col = $("<div class=col/>");
                _$colgroup.append($col);
                _$cols.add($col);
                if (i != me.cols - 1)
                {
                    $col.css({
                        marginRight: 12
                    });
                }
            }
            me.$container.append(_$colgroup);
            _$colgroup.css({
                width: (224 + 12) * me.cols - 12
            });
        }
    }
    
    me.clear = function()
    {
        _$colgroup.find(".post").remove();
    };
    
    function _nextPage()
    {
        me.pageIndex++;
        fs.app.postAgent.queryPosts({ pageIndex: me.pageIndex, pageSize: me.pageSize }).done(function(p_posts)
        {
            p_posts.forEach(function(p_post)
            {
                p_post.publishTime = new Date(p_post.publishTime); 
                
                me.colIndex++;
                if (me.colIndex == me.cols)
                {
                    me.colIndex = 0;
                }
                var $col = _$cols[me.colIndex];
                
                var channel = fs.app.subscriptionAgent.channels[p_post.cid];
                var $post = $("<div class=post>");
                $post.attr("id", p_post._id);
                
                var $thumb = $("<div id=thumb>");
                $post.append($thumb);
                
                var $title = $("<div id=title>");
                $title.text(p_post.title);
                $post.append($title);
                me.$container.append($post);
                
                
                
                var $info = $("<div id=info>");
                
                var $channel = $("<a id=channel>");
                $channel.text(channel.title);
                $channel.attr("title", channel.title);
                $info.append($channel);
                
                var $time = $("<div id=time>");
                if (p_post.publishTime >= Date.today)
                {
                    $time.text($format(p_post.publishTime, "HH:mm"));
                }
                else
                {
                    $time.text($format(p_post.publishTime, "M月d日"));
                }
                $info.append($time);
                
                $post.append($info);
                
                $col.append($post);
            });
        });
    }
    
    return me.endOfClass(arguments);
};
fs.view.PostListView.className = "fs.view.PostListView";
