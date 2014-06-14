$ns("fss");

fss.settings = {
    db: {
        host: "127.0.0.1",
        port: "27017",
        database: "feedstore"
    },
    channels: {
        update: {
            defaultEncoding: "UTF-8",
            timeout: 10000
        }
    }
};