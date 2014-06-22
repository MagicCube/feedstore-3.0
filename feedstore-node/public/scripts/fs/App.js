$ns("fs");

$import("lib.transit.transit");

$import("fs.biz.PostAgent");
$import("fs.biz.SubscriptionAgent");
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
    
    me.subscriptionAgent = null;
    me.postAgent = null;
    
    me.categoryListView = null;
    me.postListView = null;
    me.postDetailView = null;
    
    var _$overlay = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        me.css({ position: "absolute" });

        me.subscriptionAgent = new fs.biz.SubscriptionAgent();
        me.postAgent = new fs.biz.PostAgent();
        
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
            id: "postDetail"
        });
    }

    base.run = me.run;
    me.run = function(args)
    {
        me.subscriptionAgent.load().done(function()
        {
            me.postListView.load();
        });
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
    };
    
    me.hideOverlay = function()
    {
        $(document.body).css({
            overflow: "auto"
        });
        
        me.postDetailView.$container.transit({
            opacity: 0
        }, "fast", function()
        {
            me.removeSubview(me.postDetailView);
        });
        
        _$overlay.transit({ opacity: 0 }, "fast", function()
        {
            _$overlay.detach();
        }, "fast");
        
        me.$container.transit({
            scale: 1
        });
    };
    
    
    
    
    function _postListView_onpostclick(e)
    {
        me.showOverlay();
        me.postDetailView.setPost(e.post);
        
        var width = window.innerWidth * 0.85;
        if (width > 1024)
        {
            width = 1024;
        }
        me.postDetailView.setFrame({
            top: 50,
            bottom: 0,
            left: (window.innerWidth - width) / 2,
            width: width
        });
        me.postDetailView.css({
            position: "fixed",
            zIndex: 999,
            opacity: 0,
            y: 400
        });
        me.addSubview(me.postDetailView, $("body"));
        
        
        me.$container.transit({
            scale: 0.9
        });
        
        me.postDetailView.$container.transit({
            opacity: 1,
            y: 0
        }, "fast");
        
    }

    return me.endOfClass(arguments);
};
fs.App.className = "fs.App";
