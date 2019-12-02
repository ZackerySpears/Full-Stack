const secrets = {
    //The URL that we use to connect to the MongoDB Atlas Cluster
    dbUrl:'mongodb+srv://Noblexzone:456password@cluster0-4hlwq.mongodb.net/test?retryWrites=true&w=majority'
};

const getSecret  = key => secrets[key];

module.exports = getSecret;