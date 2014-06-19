$ns("fss.model");

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
    lastSuccessfulUpdateTime: Date
});
