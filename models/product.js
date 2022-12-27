const { ObjectId } = require("mongodb");
const { getDB } = require("../util/database");
class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.id = id ? new ObjectId(id) : null;
    this.userId = userId ? new ObjectId(userId) : null;
  }
  save() {
    const db = getDB();
    let _dbOp;
    if (this.id) {
      _dbOp = db
        .collection("products")
        .updateOne({ _id: this.id }, { $set: this });
    } else {
      _dbOp = db.collection("products").insertOne(this);
    }
    return _dbOp;
  }
  static fetchAll() {
    const db = getDB();
    const products = db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch(console.error);

    return products;
  }

  static findById(id) {
    const db = getDB();
    const product = db
      .collection("products")
      .findOne({ _id: new ObjectId(id) })
      .then((product) => product)
      .catch(console.error);
    return product;
  }

  static deleteProduct(id) {
    const db = getDB();
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) })
      .catch(console.error);
  }
}

module.exports = { Product };

/**
 * @description Sequelize code for connecting to MySql database
 */
// -----------------------------------------------------------------------
// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: {
//     type: Sequelize.STRING,
//   },
//   price: { type: Sequelize.DOUBLE, allowNull: false },
//   description: { type: Sequelize.STRING, allowNull: false },
//   imageUrl: { type: Sequelize.STRING, allowNull: false },
// });

// module.exports.Product = Product;
// -----------------------------------------------------------------------
