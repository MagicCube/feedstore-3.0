module.exports = {
    "/": function(req, res)
    {
        var pager = {
            pageIndex: isEmptyString(req.query.pageIndex) ? 0 : parseInt(req.query.pageIndex),
            pageSize: isEmptyString(req.query.pageSize) ? 10 : parseInt(req.query.pageSize)
        };
        var search = {
            cid: isEmptyString(req.query.cid) ? null : req.query.cid,
        };
        var params = mx.merge({}, pager, search);
        fss.db.DbConnection.connect();
        fss.server.postManager.queryPosts(params, function(p_error, p_posts)
        {
            fss.db.DbConnection.disconnect();
            if (isEmpty(p_error))
            {
                res.json(p_posts);
            }
            else
            {
                mx.logger.error(p_error);
                res.statusCode = 500;
                res.end(p_error.message);
            }
        });
    }
};