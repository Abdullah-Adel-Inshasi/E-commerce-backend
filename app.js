require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const { mongoConnect } = require("./util/database");

const errorController = require("./controllers/error");
// Models
const { User } = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, _res, next) => {
  User.findById("63a9b291643feba55a679fc3")
    .then((mongoUser) => {
      const user = new User({
        id: mongoUser._id,
        cart: mongoUser.cart,
        email: mongoUser.email,
        name: mongoUser.name,
      });
      req.user = user;
      next();
    })
    .catch(console.error);
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// app.use(errorController.get404);
mongoConnect(() => {
  app.listen(3000);
});
