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
            onpostclick: _postListView_onpostclick
        });
        me.postListView.css({
            marginTop: 62
        });
        me.addSubview(me.postListView);
        
        me.postDetailView = new fs.view.PostDetailView({
            id: "postDetail",
            frame: { height: window.innerHeight - 80, bottom: 0, width: 1024 }
        });
        me.postDetailView.$container.css({
            position: "fixed",
            zIndex: 9999
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
        if (_$overlay == null)
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
        _$overlay.transit({ opacity: 0 }, "fast", function()
        {
            _$overlay.detach();
        });
    };
    
    
    
    
    function _postListView_onpostclick(e)
    {
        me.showOverlay();
        me.addSubview(me.postDetailView);
        me.postDetailView.setFrame({
            left: (window.innerWidth - me.postDetailView.frame.width) / 2
        });
        me.postDetailView.setPost(e.post);
    }

    return me.endOfClass(arguments);
};
fs.App.className = "fs.App";
