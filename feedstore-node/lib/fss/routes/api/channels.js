module.exports = {
    "/": function(req, res)
    {
        res.json(fss.app.channelManager.channels);
    },
    
    "init": function(req, res)
    {
        channelManager.init();
    }
};