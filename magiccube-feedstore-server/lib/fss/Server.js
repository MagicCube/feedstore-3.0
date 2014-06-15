$ns("fss");

var async = require("async");
var express = require("express");
var http = require("http");
var path = require("path");


$import("fss.db.DbConnection");
$import("fss.model.Channel");
$import("fss.biz.ChannelManager");

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
    me.runat = null;
    
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
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.runningMode = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
        me.runat = process.env.RUNAT ? process.env.RUNAT : "local";
        
        _printHeader();
        
        _setStatus("initializing");
        
        _loadSettings();
        
        // Connect to MongoDB
        fss.db.DbConnection.connect();
        
        // Initialize managers
        me.channelManager = new fss.biz.ChannelManager();
        
        _setStatus("initialized");
    };
    
    me.start = function(p_callback)
    {
        _setStatus("starting");
        
        async.series([
            me.channelManager.load,
            _initExpressApp
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
        _startHttpServer(function()
        {
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
        app.set("port", process.env.PORT || 18080);
        app.use(express.favicon());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(path.join(__dirname, "public")));
        if ("development" == me.runningMode)
        {
            app.use(express.errorHandler());
        }
        _initRoutes(app);
        me.expressApp = app;
    }
    
    function _initRoutes(p_app)
    {
        var routes = require("./routes");
        routes.applyAll(p_app, [
            "/api/channels"
        ]);
    }
    
    function _initHttpServer(p_callback)
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
        mx.logger.info("FeedStore server status is now switch to <%s>", p_status.toUpperCase());
        me.status = p_status;
    }
    
    
    
    
    
    function _printHeader()
    {
        console.log($format("\n", 25));
        console.log($format(new Date(), "yyyy-MM-dd HH:mm:ss"));
        console.log("***************************************************************************");
        console.log(" MagicCube FeedStore 3.0 (%s@%s)", me.runningMode.toUpperCase(), me.runat.toUpperCase());
        console.log("***************************************************************************");
    }
    
    function _loadSettings()
    {
        
    }
    
    return me.endOfClass(arguments);
};
fss.server = new fss.Server();
module.exports = fss.Server;