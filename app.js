const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const errorController = require("./controllers/error");
// Models
const { User } = require("./models/user");
const { Product } = require("./models/product");
const { Cart } = require("./models/cart");
const { CartItem } = require("./models/cart-item");
const { Order } = require("./models/order");
const { OrderItem } = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, _res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(console.error);
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
// Relations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });

sequelize

  .sync( )
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        email: "abdullahadel@nice-el-nice.com",
        name: "Abdullah",
      });
    }
    return user;
  })
  .then((user) => {
    return user.getCart().then((cart) => {
      console.log(cart);
      if (cart) {
        Promise.resolve(cart);
      } else {
        return user.createCart();
      }
    });
  })
  .then(() => {
    app.listen(3000);
  })
  .catch(console.error);
