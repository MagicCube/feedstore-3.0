$ns("fss.db");

var mongoose = require('mongoose');

fss.db.DbConnectionClass = function()
{
    var me = $extend(mx.Component);
    var base = {};

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };
    
    me.connect = function()
    {
        mongoose.connect(String.format("mongodb://{host}:{port}/{database}", fss.settings.db));
    };
    
    me.registerModel = function(p_name, p_schema)
    {
        var model = mongoose.model(p_name, new mongoose.Schema(p_schema));
        return model;
    };
    
    return me.endOfClass(arguments);
};
fss.db.DbConnection = new fss.db.DbConnectionClass();
module.exports = fss.db.DbConnectionClass;