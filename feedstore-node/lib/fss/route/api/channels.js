module.exports = {
    "/": function(req, res)
    {
        res.json(fss.server.channelManager.channels);
    },
    
    "init": function(req, res)
    {
        channelManager.init();
    }
};