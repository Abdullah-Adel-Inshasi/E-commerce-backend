const { MongoClient } = require("mongodb");
const URI = `mongodb+srv://${process.env.MONGO_CLIENT_USERNAME}:${process.env.MONGO_CLIENT_PASSWORD}@cluster0.oxsvm3u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(URI);
// test commit
module.exports.mongoClient = client;
