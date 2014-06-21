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

        me.subscriptionAgent = new fs.biz.SubscriptionAgent();
        me.postAgent = new fs.biz.PostAgent();
        
        me.categoryListView = new fs.view.CateogryListView({
            id: "categoryList",
            frame: { right: 12 }
        });
        me.addSubview(me.categoryListView, me.$container.find("#header"));
        
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
            paddingTop: 62
        });
        me.addSubview(me.postListView);
        
        
        me.postDetailView = new fs.view.PostDetailView({
            id: "postDetail"
        });
    };

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
        _$overlay.transit({ opacity: 1 }, "fast");
    };
    
    me.hideOverlay = function()
    {
        $(document.body).css({
            overflow: "auto"
        });
        me.postDetailView.$container.fadeOut();
        _$overlay.transit({ opacity: 0 }, "fast", function()
        {
            _$overlay.detach();
        });
    };
    
    
    
    
    function _postListView_onpostclick(e)
    {
        me.showOverlay();
        
        me.postDetailView.$container.css({
            opacity: 0,
            position: "fixed",
            zIndex: 9999,
            top: e.$post.offset().top - document.body.scrollTop,
            left: e.$post.offset().left,
            width: e.$post.width(),
            height: e.$post.height()
        });
        me.postDetailView.setPost(e.post);
        me.$container.append(me.postDetailView.$container);
        
        var width = window.innerWidth * 0.8;
        if (width > 1280)
        {
            width = 1280;
        }
        var height = window.innerHeight - 80;
        var left = (window.innerWidth - width) / 2;
        me.postDetailView.$container.transit({
            opacity: 1,
            left: left,
            top: 80,
            width: width,
            height: height
        });
    }

    return me.endOfClass(arguments);
};
fs.App.className = "fs.App";
