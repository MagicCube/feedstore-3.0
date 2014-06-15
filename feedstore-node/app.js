var path = require("path");
var mx = require("mxframework");

$assembly("fss");
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