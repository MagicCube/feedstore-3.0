$ns("fss.model");

var mongoose = require("mongoose");

fss.model.Channel = fss.db.DbConnection.registerModel("Channel", {
    cid: { type: String, index: true },
    title: String,
    description: String,
    copyright: String,
    feedUrl: String,
    linkUrl: String,
    lastPublishTime: Date,
    lastUpdateTime: Date,
    lastUpdateStatus: Number,
    lastSuccessfulUpdateTime: Date,
    headnews: [ new mongoose.Schema({ 
        pid: String,
        title: String,
        image: { url: String, width: Number, height: Number },
        publishTime: { type: Date, index: true }
    }) ]
});
