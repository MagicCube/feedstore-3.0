$ns("fss");

var async = require("async");
var express = require("express");
var http = require("http");
var path = require("path");


$import("fss.db.DbConnection");
$import("fss.biz.ChannelManager");
$import("fss.biz.PostManager");

fss.Server = function()
{
    var me = $extend(mx.Component);
    me.autoInit = false;
    var base = {};
    
    /*
     * development / production
     */
    me.runningMode = null;
    
    /*
     * local / bae
     */
    me.runAt = null;
    
    /*
     * null,
     * initializing,
     * initialized,
     * starting,
     * started,
     * preparing
     * running,
     * error
     */
    me.status = null;
    
    me.expressApp = null;
    me.channelManager = null;
    me.postManager = null;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.runningMode = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
        me.runAt = process.env.FSS_RUN_AT ? process.env.FSS_RUN_AT : "local";
        
        _loadSettings();
        _printHeader();

        _setStatus("initializing");
        
        // Initialize managers
        me.channelManager = new fss.biz.ChannelManager();
        me.postManager = new fss.biz.PostManager();
        
        _setStatus("initialized");
    };
    
    me.start = function(p_callback)
    {
        _setStatus("starting");
        
        async.series([
            me.channelManager.load
        ], function(p_err, p_results)
        {
            if (isEmpty(p_err))
            {
                _setStatus("started");
            }
            else
            {
                mx.logger.error(p_err);
                _setStatus("error");
            }
            
            p_callback(p_err, p_results);
        });
    };
    
    me.run = function(p_callback)
    {        
        _setStatus("preparing");
        _initExpressApp();
        _startHttpServer(function()
        {
            if (fss.settings.update.enabled !== false)
            {
                fss.server.channelManager.startSheduledUpdate();
            }
            
            _setStatus("running");
            
            if (isFunction(p_callback))
            {
                p_callback();
            }
        });
    };
    
    
    
    
    function _initExpressApp()
    {
        var app = express();
        app.set("port", process.env.PORT || fss.settings.http.port);
        app.use(express.favicon());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static($mappath("~/public")));
        if ("development" == me.runningMode)
        {
            app.use(express.errorHandler());
        }
        _initRoutes(app);
        me.expressApp = app;
    }
    
    function _initRoutes(p_app)
    {
        var routes = require("./route");
        routes.applyAll(p_app, [
            "/api/channels",
            "/api/posts",
            "/api/subscriptions"
        ]);
    }
    
    function _startHttpServer(p_callback)
    {
        http.createServer(me.expressApp).listen(me.expressApp.get("port"), function()
        {
            mx.logger.info("HTTP server start to listen at " + me.expressApp.get("port") + ".");
            if (isFunction(p_callback))
            {
                p_callback();
            }
        });
    }
    
    
    
    
    function _setStatus(p_status)
    {
        mx.logger.info("FeedStore server status is now switch to <" + p_status.toUpperCase() + ">");
        me.status = p_status;
    }
    
    
    
    
    
    function _printHeader()
    {
        console.log();
        console.log("***************************************************************************");
        console.log(" MagicCube FeedStore 3.0 (" + me.runningMode.toUpperCase() + " @ " + me.runAt.toUpperCase() + ")");
        console.log("***************************************************************************");
    }
    
    function _printLog(p_message, p_args)
    {
        if (isEmpty(p_args))
        {
            console.log($format(new Date(), "yyyy-MM-dd HH:mm:ss") + " " + p_message);
        }
        else
        {
            console.log($format(new Date(), "yyyy-MM-dd HH:mm:ss") + " " + p_message, p_args);
        }
    }
    
    function _loadSettings()
    {
        console.log($format("\n", 50));
        _printLog("MagicCube FeedStore Server 3.0 (magiccube-feedstore-3.0/feedstore-node)");
        _printLog("Copyright 2014 MagicCube. All rights reserved.");
        _printLog("Powered by MagicCube MXFramework.\n");
        _printLog("MagicCube FeedStore is now loading settings...");
        var defaultSettings = require($mappath("~/settings/default.json"));
        var specificSettings = require($mappath("~/settings/{runAt}.json", me));
        fss.settings = $merge(true, defaultSettings, specificSettings);
        
        for (var key in fss.settings)
        {
            _printLog("fss.settings." + key + " = " + JSON.stringify(fss.settings[key]) + ";");
        }
        
        if (notEmpty(fss.settings.log))
        {
            if (fss.settings.log.logger === "console")
            {
                mx.logger = require("tracer").console(fss.settings.log.config);
            }
            
            if (notEmpty(fss.settings.log.level) && isFunction(mx.logger.setLevel))
            {
                mx.logger.setLevel(fss.settings.log.level);
            }
        }
    }
    
    return me.endOfClass(arguments);
};
fss.server = new fss.Server();