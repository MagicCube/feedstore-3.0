module.exports = {
    "/": function(req, res)
    {
        res.json(fss.server.channelManager.channels);
    }
};