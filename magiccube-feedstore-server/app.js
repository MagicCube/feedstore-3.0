var path = require("path");
var mx = require("mxframework");

$module("fss", path.resolve(module.paths[0], "../lib/fss"));
$import("fss.Server");

fss.server.init();
fss.server.start(function(p_error, p_result)
{
    if (isEmpty(p_error))
    {
        fss.server.run();
    }
    else
    {
        process.exit();
    }
});