$ns("fss.biz");

var async = require("async");
var cheerio = require("cheerio");

$import("fss.model.Post");

fss.biz.PostManager = function()
{
    var me = $extend(mx.Component);
    var base = {};

    
    me.queryPosts = function(p_params, p_callback)
    {
        fss.model.Post.find({}, {}, { skip: (p_params.pageIndex * p_params.pageSize) }).sort("-publishTime").limit(p_params.pageSize).exec(function(p_error, p_results)
        {
            if (isFunction(p_callback))
            {
                p_callback(p_error, p_results);
            }
        });
    };
    
    
    me.savePost = function(p_rawPost, p_channel, p_callback)
    {
        var content = "";
        if (notEmpty(p_rawPost.content))
        {
            content = p_rawPost.content;
        }
        else if (notEmpty(p_rawPost.description) && content.length < p_rawPost.description.length)
        {
            content = p_rawPost.description;
        }
        
        var img = null;
        var $dom = cheerio.load(content);
        var $img = $dom("img:first-child");
        if ($img.length > 0 && !isEmptyString($img.attr("src")))
        {
            img = {
                url: $img.attr("src")
            };
        }
        
        var post = new fss.model.Post({
            pid: p_rawPost.link,
            cid: p_channel.id,
            title: p_rawPost.title,
            content: content,
            author: p_rawPost.author,
            linkUrl: p_rawPost.link,
            image: img,
            publishTime: p_rawPost.pubDate,
        });
        post.save(p_callback);
    };
    
    me.savePosts = function(p_rawPosts, p_channel, p_callback)
    {
        var saveRawPosts = p_rawPosts.map(function(p_rawPost)
        {
            return function(p_callback)
            {
                me.savePost(p_rawPost, p_channel, p_callback);
            };
        });
        async.series(saveRawPosts, function(p_error, p_results)
        {
            if (p_error !== null && p_results !== null)
            {
                mx.logger.info(p_rawPosts.length + " posts from channel <" + p_channel.title + "> has been saved.");
            }
            
            if (isFunction(p_callback))
            {
                p_callback(p_error, p_results);
            }
        });
    };
    
    return me.endOfClass(arguments);
};