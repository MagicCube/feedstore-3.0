module.exports = {
    "/": function(req, res)
    {
        fss.server.postManager.getPosts(function(p_error, p_posts)
        {
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