$ns("fss");

fss.settings = {
    runat: "local",
    db: {
        host: "127.0.0.1",
        port: "27017",
        database: "feedstore"
    },
    update: {
        defaultEncoding: "UTF-8",
        timeout: 10000,
        parallelLimit: 5
    }
};