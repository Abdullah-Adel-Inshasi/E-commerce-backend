const { ObjectId } = require("mongodb");
const { getDB } = require("../util/database");

class User {
  constructor({ name, email, cart, id }) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this.id = id ? new ObjectId(id) : null;
  }
  save() {
    const db = getDB();
    const collection = db.collection("users");
    let _dbOp;
    if (this.id) {
      _dbOp = collection.updateOne({ _id: this.id }, { $set: this });
    } else {
      _dbOp = collection.insertOne(this);
    }
    return _dbOp.catch(console.error);
  }

  static findById(id) {
    const db = getDB();
    const collection = db.collection("users");
    return collection.findOne({ _id: new ObjectId(id) });
  }

  addToCart(productId) {
    const db = getDB();
    let quantity = 1;
    const updatedCart = [...this.cart.items];
    const productInCart = this.cart.items.findIndex((cartProduct) => {
      return (
        cartProduct.productId.toString() === new ObjectId(productId).toString()
      );
    });
    if (productInCart !== -1) {
      quantity += updatedCart[productInCart].quantity;
      updatedCart[productInCart].quantity = quantity;
    } else {
      updatedCart.push({ productId: new ObjectId(productId), quantity });
    }

    return db
      .collection("users")
      .findOneAndUpdate(
        { _id: this.id },
        { $set: { cart: { items: updatedCart } } }
      );
  }

  getCart() {
    const db = getDB();
    const productIds = this.cart.items.map((cartItem) => cartItem.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          const productQuantity = this.cart.items.find(
            (cartItem) =>
              cartItem.productId.toString() === product._id.toString()
          ).quantity;

          return {
            ...product,
            quantity: productQuantity,
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const db = getDB();
    const updatedCartItems = this.cart.items.filter(
      (cartItem) => cartItem.productId.toString() !== productId.toString()
    );
    return db
      .collection("users")
      .findOneAndUpdate(
        { _id: this.id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  createOrder() {
    const db = getDB();
    return this.getCart().then((cartItems) => {
      const cart = cartItems.map((cartItem) => {
        return {
          _id: new ObjectId(cartItem.id),
          quantity: cartItem.quantity,
          imageUrl: cartItem.imageUrl,
          userId: new ObjectId(cartItem.userId),
          title: cartItem.title,
        };
      });
      db.collection("orders")
        .insertOne({
          order: cart,
          user: { _id: this.id, name: this.name },
        })
        .then((result) => {
          return db
            .collection("users")
            .findOneAndUpdate(
              { _id: this.id },
              { $set: { cart: { items: [] } } }
            );
        });
    });
  }
}
module.exports = { User };

/**
 * @description Sequelize User Model
 */
// const sequelize = require("../util/database");
// const Sequelize = require("sequelize");

//  const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// exports.User = User
