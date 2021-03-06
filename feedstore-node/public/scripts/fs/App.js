$ns("fs");

$import("lib.transit.transit");

$import("fs.biz.ChannelAgent");
$import("fs.biz.PostAgent");
$import("fs.util.DateTimeUtil");
$import("fs.view.CateogryListView");
$import("fs.view.PostListView");
$import("fs.view.PostDetailView");

fs.App = function()
{
    var me = $extend(mx.app.Application);
    me.appId = "fs.App";
    me.appDisplayName = "MagicCube FeedStore";
    var base = {};
        
    me.categoryListView = null;
    me.postListView = null;
    me.postDetailView = null;
    
    var _$overlay = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        me.css({ position: "absolute" });
        
        _initCategoryListView();
        _initPostListView();
        _initPostDetailView();
    };
    
    function _initCategoryListView()
    {
        me.categoryListView = new fs.view.CateogryListView({
            id: "categoryList",
            frame: { right: 12 }
        });
        me.addSubview(me.categoryListView, me.$container.find("#header"));
    }
    
    function _initPostListView()
    {
        me.postListView = new fs.view.PostListView({
            id: "postList",
            frame: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            },
            onpostclick: _postListView_onpostclick
        });
        me.postListView.css({
            paddingTop: 62 + (window.navigator.standalone ? 20 : 0)
        });
        me.addSubview(me.postListView);
    }
    
    function _initPostDetailView()
    {
        me.postDetailView = new fs.view.PostDetailView({
            id: "postDetail",
            onshow: function()
            {
                me.showOverlay();
            },
            onhide: function()
            {
                me.hideOverlay();
            }
        });
    }

    base.run = me.run;
    me.run = function(args)
    {
        me.postListView.load();
    };
    
    me.getServiceUrl = function(p_path)
    {
        return $mappath("~/api" + p_path);
    };
    
    
    
    me.showOverlay = function()
    {
        if (_$overlay === null)
        {
            _$overlay = $("<div id=overlay>");
            _$overlay.on("click", me.hideOverlay);
        }
        _$overlay.css("opacity", 0);
        $(document.body).css({
            overflow: "hidden"
        }).append(_$overlay);
        _$overlay.transit({ opacity: 1 }, 100);
        
        if (window.innerWidth >= 1280 && window.innerWidth <= 1920)
        {
            me.$container.transit({
                scale: 0.9
            });
        }
    };
    
    me.hideOverlay = function()
    {
        $(document.body).css({
            overflow: "auto"
        });
        _$overlay.transit({ opacity: 0 }, "fast", function()
        {
            _$overlay.detach();
        }, "fast");
        
        if (window.innerWidth >= 1280 && window.innerWidth <= 1920)
        {
            me.$container.transit({
                scale: 1
            });
        }
    };
    
    
    
    
    function _postListView_onpostclick(e)
    {
        me.postDetailView.showPost(e.post);
    }

    return me.endOfClass(arguments);
};
fs.App.className = "fs.App";
