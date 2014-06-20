var BaeImage = require('baev3-image');
var BaeImageTransform = BaeImage.Transform;
var BaeImageConstant = BaeImage.Constant;
var BaeImageService = BaeImage.Service;
var appKey = 'nsRLSS0Gv8sqViOfDTjuWNz2';
var secretKey = 'GvGdabHuSN5H00isLUBKjbhBYbBnkLNL';
var imageService = new BaeImageService(appKey, secretKey, "image.duapp.com");

module.exports = {
        "/": function(req, res)
        {
            var imageTrans = new BaeImageTransform();

            // 设置变换属性
            imageTrans.setZooming({zoomingType: BaeImageConstant.TRANSFORM_ZOOMING_TYPE_WIDTH,
                size: 195});

            // 生成图片
            imageService.applyTransformByObject(req.query.url, imageTrans, function(p_err, p_result)
            {
                if (notEmpty(p_err))
                {
                    res.statusCode = 500;
                    res.end('transform error' + p_err.message);
                    return;
                }

                var data = new Buffer(p_result['response_params'].image_data, 'base64');
                res.writeHead(200, {'Content-Type': 'image/jpg' });
                res.end(data);
                res.end(req.query.url);
            });
        }
};