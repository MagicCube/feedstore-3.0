exports.applyAll = function(app, p_routeNames)
{
    p_routeNames.forEach(function(p_routeName)
    {
        applyRoute(app, p_routeName);
    });
};


function applyRoute(app, p_routeName)
{
    var route = require("./" + p_routeName);
    for (var key in route)
    {        
        var handler = route[key];
        if (!mx.isFunction(handler))
        {
            continue;
        }
        
        if (key.indexOf(" ") == -1)
        {
            key = "get " + key;
        }
        var parts = key.split(" ");
        if (parts.length != 2)
        {
            throw new Error("'" + key + "' can not be resolved as a path.");
        }
        var verb = parts[0].toLowerCase().trim();
        var path = parts[1].trim();
        if (path == "/")
        {
            path = p_routeName;
        }
        else
        {
            path = p_routeName + "/" + path;
        }
        
        switch (verb)
        {
            case "get":
            case "post":
            case "put":
            case "delete":
                app[verb](path, handler);
                mx.logger.debug("[Routes] ", verb, path);
                break;
        }
    }
}