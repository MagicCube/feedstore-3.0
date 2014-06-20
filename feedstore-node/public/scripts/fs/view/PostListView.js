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
    
    var _$cols = [];
    var _$colgroup = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
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
        
        me.colIndex = -1;
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
        $time.text(fs.util.DateTimeUtil.getShortString(p_post.publishTime));
        $time.attr("title", p_post.publishTime.toLocaleString());
        $info.append($time);
        
        $post.append($info);
        
        $col.append($post);
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
        me.pageIndex = -1;
        me.colIndex = -1;
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
        
        me.pageIndex++;
        _setLoading();
        fs.app.postAgent.queryPosts({ pageIndex: me.pageIndex, pageSize: me.pageSize }).done(function(p_posts)
        {
            _setLoading(false);
            me.addPosts(p_posts);
        });
    }
    
    function _checkPaging()
    {
        var y = document.body.scrollTop + document.body.offsetHeight;
        if (y > document.body.scrollHeight - 50)
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
    $(window).on("resize", _onresize);
    
    
    function _onscroll(e)
    {
        _checkPaging();
    }
    $(window).on("scroll", _onscroll);
    
    return me.endOfClass(arguments);
};
fs.view.PostListView.className = "fs.view.PostListView";
