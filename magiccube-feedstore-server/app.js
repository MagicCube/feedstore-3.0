var path = require("path");
var mx = require("mxframework");

console.log("\033[2J");
console.log("**********************************************************");
console.log(" MagicCube FeedStore server is now initializing...");
console.log("**********************************************************\n\n");

/**
 * Module fss
 */
$module("fss", path.resolve(module.paths[0], "../lib/fss"));
$ns("fss");
require("./settings.js");
$import("fss.Application");


var express = require("express"),
    http = require("http"),
    path = require("path");

var app = express();

// Setup environments.
app.set("port", process.env.PORT || 18080);
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

// Setup routes.
var routes = require("./routes");
routes.applyAll(app, [
    "/api/channels"
]);

// For development only.
if ("development" == app.get("env"))
{
    app.use(express.errorHandler());
}

// Start server.
http.createServer(app).listen(app.get("port"), function()
{
    //mx.logger.info("MagicCube FeedStore server is now listening on port " + app.get("port"));
});


fss.app.init();
fss.app.run();