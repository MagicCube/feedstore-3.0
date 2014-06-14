$ns("fs.model");

fs.model.Channel = fss.db.DbConnection.registerModel("Channel", {
    cid: { type: String, index: true },
    title: String,
    feedUrl: String,
    linkUrl: String,
    lastPublishTime: Date,
    lastUpdateTime: Date,
    lastUpdateStatus: Number,
    lastSuccessfulUpdateTime: Date
});
