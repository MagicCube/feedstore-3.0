module.exports = {
    "/": function(req, res)
    {
        var result = {
            channels: fss.server.channelManager.channels
        };
        res.json(result);
    }
};