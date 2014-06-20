$ns("fs");

$import("fs.biz.PostAgent");
$import("fs.biz.SubscriptionAgent");
$import("fs.view.PostListView");

fs.App = function()
{
    var me = $extend(mx.app.Application);
    me.appId = "fs.App";
    me.appDisplayName = "MagicCube FeedStore";
    var base = {};
    
    me.subscriptionAgent = null;
    me.postAgent = null;
    
    me.postListView = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);

        me.subscriptionAgent = new fs.biz.SubscriptionAgent();
        me.postAgent = new fs.biz.PostAgent();
        
        me.postListView = new fs.view.PostListView({
            frame: { top: 0, bottom: 0, left: 0, right: 0 }
        });
        me.postListView.css({
            marginTop: 62
        });
        me.addSubview(me.postListView);
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

    return me.endOfClass(arguments);
};
fs.App.className = "fs.App";
