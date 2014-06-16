$ns("fss.db");

var mongoose = require('mongoose');

fss.db.DbConnectionClass = function()
{
    var me = $extend(mx.Component);
    var base = {};
    
    me.connected = false;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        mongoose.connection.on("open", _onopen);
        mongoose.connection.on("close", _onclose);
        mongoose.connection.on("error", _onerror);
    };
    
    me.getConnectionUrl = function()
    {
        if (isEmpty(fss.settings.db.username))
        {
            return String.format("mongodb://{host}:{port}/{database}", fss.settings.db);
        }
        else
        {
            return String.format("mongodb://{username}:{password}@{host}:{port}/{database}", fss.settings.db);
        }
    };
    
    
    
    me.connect = function()
    {
        if (me.connected)
        {
            mx.logger.info("DbConnection is already connected.");
        }
        else
        {
            mx.logger.info("DbConnection is now connecting to " + me.getConnectionUrl());
            mongoose.connect(me.getConnectionUrl());
        }
    };
    
    me.disconnect = function()
    {
        try
        {
            mongoose.disconnect();
        }
        catch (e)
        {
            
        }
    };
    
    
    
    me.registerModel = function(p_name, p_schema)
    {
        var model = mongoose.model(p_name, new mongoose.Schema(p_schema));
        return model;
    };
    
    
    
    function _onopen()
    {
        me.connected = true;
        mx.logger.info("DbConnection is now open.");
    }
    
    function _onclose()
    {
        me.connected = false;
        mx.logger.info("DbConnection is now closed.");
    }
    
    function _onerror(err)
    {
        me.connected = false;
        mx.logger.error("An error occurred in DbConnection.");
        mx.logger.error(err);
    }
    
    return me.endOfClass(arguments);
};
fss.db.DbConnection = new fss.db.DbConnectionClass();