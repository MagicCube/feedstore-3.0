$ns("fs.view");

$include("fs.res.PostListView.css");

fs.view.PostListView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "PostListView";
    me.frame = {};
    var base = {};
    
    me.posts = [];
    
    me.cols = 0;
    me.colIndex = 0;
    me.pageIndex = 0;
    me.pageSize = 50;
    
    me.colSpace = 12;
    
    me.onpostclick = null;
    
    var _$cols = [];
    var _$colgroup = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.$container.on("click", ".post > #thumb, .post > #title", _post_onclick);
        me.$container.on("scroll", _onscroll);
        $(window).on("resize", _onresize);
    };

    me.load = function()
    {
        _onresize();
        me.clear();
        _nextPage();
    };
    
    me.resetCols = function()
    {
        var cols = Math.floor(me.frame.width / (224 + me.colSpace));
        if (cols > 6)
        {
            cols = 6;
        }
        if (me.cols === cols) return;
        
        if (_$colgroup === null)
        {
            _$colgroup = $("<div class=colgroup>");
            me.$container.append(_$colgroup);
        }

        _$cols.clear();
        me.cols = cols;
        _$colgroup.find(".col").remove();
        for (var i = 0; i < me.cols; i++)
        {
            var $col = $("<div class=col/>");
            _$colgroup.append($col);
            _$cols.add($col);
            if (i != me.cols - 1)
            {
                $col.css({
                    marginRight: me.colSpace
                });
            }
        }
        
        _$colgroup.css({
            width: (224 + me.colSpace) * me.cols - me.colSpace
        });
        
        me.colIndex = 0;
        _$colgroup.find(".post").remove();
        var posts = me.posts.clone();
        me.posts.clear();
        me.addPosts(posts);
    };
    
    me.addPost = function(p_post)
    {
        if (isString(p_post.publishTime))
        {
            p_post.publishTime = fs.util.DateTimeUtil.parseServerTime(p_post.publishTime);
        }
        me.posts.add(p_post);
        
        if (me.colIndex == me.cols)
        {
            me.colIndex = 0;
        }
        var $col = _$cols[me.colIndex];
        
        var channel = fs.app.subscriptionAgent.channels[p_post.cid];
        var $post = $("<div class=post>");
        $post.data("post", p_post);
        $post.attr("id", p_post._id);
        
        var $thumb = $("<img id=thumb>");
        $thumb.on("error", _img_onerror);
        $thumb.attr({
            //"src": (notEmpty(p_post.image) ? (fs.app.getServiceUrl("/images/?url=") + encodeURIComponent(p_post.image.url)) : me.getResourcePath("images.post-thumb-placeholder", "png"))
            "src": (notEmpty(p_post.image) ? p_post.image.url : me.getResourcePath("images.post-thumb-placeholder", "png"))
        });
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
        $time.text(fs.util.DateTimeUtil.getShortString(p_post.publishTime));
        $time.attr("title", p_post.publishTime.toLocaleString());
        $info.append($time);
        
        $post.append($info);
        
        $col.append($post);
        
        me.colIndex++;
    };

    me.addPosts = function(p_posts)
    {
        p_posts.forEach(function(p_post)
        {
            me.addPost(p_post);
        });
    };
    
    me.setPosts = function(p_posts)
    {
        me.clear();
        me.addPosts(p_posts);
    };
    
    me.clear = function(p_clearData)
    {
        me.pageIndex = 0;
        me.colIndex = 0;
        if (_$colgroup !== null)
        {
            _$colgroup.find(".post").remove();
        }
        me.posts.clear();
    };
    
    function _setLoading(p_loading)
    {
        me.loading = isEmpty(p_loading) ? true : false; 
    }
    
    function _nextPage()
    {
        if (me.loading) return;
        
        _setLoading();
        fs.app.postAgent.queryPosts({ pageIndex: me.pageIndex, pageSize: me.pageSize }).done(function(p_posts)
        {
            _setLoading(false);
            me.addPosts(p_posts);
            
            me.pageIndex++;
        });
    }
    
    function _checkPaging()
    {
        if (_$cols === null || _$cols.length === 0) return;
        var y = me.$container[0].scrollTop + document.body.offsetHeight;
        var minHeight = _$cols.reduce(function(p_min, $p_col)
        {
            if (isEmpty(p_min) || p_min > $p_col.height())
            {
                return $p_col.height();
            }
            else
            {
                return p_min;
            }
        }, Number.MAX_VALUE);
        if (y > minHeight + 20)
        {
            _nextPage();
        }
    }
    
    
    
    function _onresize(e)
    {
        me.frame.height = me.$container.height();
        if (me.frame.width === me.$container.width())
        {
            return;
        }
        
        me.frame.width = me.$container.width();
        
        me.resetCols();
        
        _checkPaging();
    }
    
    
    function _onscroll(e)
    {
        _checkPaging();
    }
    
    function _post_onclick(e)
    {
        var $post = $(e.currentTarget).parent();
        var post = $post.data("post");
        me.trigger("postclick", { post: post, $post: $post });
    }
    
    function _img_onerror(e)
    {
        e.target.src = me.getResourcePath("images.post-thumb-placeholder", "png");
    }
    
    return me.endOfClass(arguments);
};
fs.view.PostListView.className = "fs.view.PostListView";
