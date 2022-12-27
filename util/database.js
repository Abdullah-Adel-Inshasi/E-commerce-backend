const { MongoClient } = require("mongodb");
const URI = `mongodb+srv://${process.env.MONGO_CLIENT_USERNAME}:${process.env.MONGO_CLIENT_PASSWORD}@cluster0.oxsvm3u.mongodb.net/shop?retryWrites=true&w=majority`;
let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(URI)
    .then((client) => {
      callback();
      _db = client.db();
    })
    .catch(console.error);
};

const getDB = () => {
  if (!_db) {
    throw new Error("No Database found");
  }

  return _db;
};
// test commit
module.exports = { mongoConnect, getDB };
