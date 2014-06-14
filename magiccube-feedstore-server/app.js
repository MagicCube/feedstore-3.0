var path = require("path");
var mx = require("mxframework");

console.log("\033[2J");
console.log("***************************************************************************");
console.log(" MagicCube FeedStore 3.0 (https://github.com/MagicCube/feedstore-3.0)");
console.log("***************************************************************************");








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









/**
 * Module fss
 */
$module("fss", path.resolve(module.paths[0], "../lib/fss"));
require("./settings.js");
$import("fss.server");

// Initialize Server
fss.server.init();
fss.server.start(function()
{
    // Start HTTP server.
    http.createServer(app).listen(app.get("port"), function()
    {
        
    });
});