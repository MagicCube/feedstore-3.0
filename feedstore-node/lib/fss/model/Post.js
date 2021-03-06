$ns("fss.model");

var mongoose = require("mongoose");

fss.model.Post = fss.db.DbConnection.registerModel("Post", {
    pid: { type: String, index: true },
    channelId: { type: mongoose.Schema.Types.ObjectId, index: true },
    title: String,
    content: String,
    author: String,
    linkUrl: String,
    image: { url: String, width: Number, height: Number },
    imageSize: { type: Number, index: true },
    imageCount: Number,
    publishTime: { type: Date, index: true },
    createTime: { type: Date, default: Date.now }
});
