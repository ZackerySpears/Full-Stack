const secrets = {
    //The URL that we use to connect to the MongoDB Atlas Cluster
    dbUrl:'mongodb+srv://NoblexZone:EX$j!yj9mhu%RpT@cluster0-4hlwq.mongodb.net/test?retryWrites=true&w=majority'
};

const getSecret  = key => secrets[key];

module.exports = getSecret;