module.exports = {
    "/": function(req, res)
    {
        fss.server.postManager.getPosts(function(p_error, p_posts)
        {
            if (notEmpty(p_error))
            {
                res.json(p_posts);
            }
            else
            {
                res.json(p_error);
            }
        });
    }
};