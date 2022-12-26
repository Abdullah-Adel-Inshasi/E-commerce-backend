require('dotenv').config()
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const { mongoClient } = require("./util/database");

const errorController = require("./controllers/error");
// Models
// const { User } = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, _res, next) => {
//   User.findByPk(1)
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch(console.error);
// });

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);

// app.use(errorController.get404);
console.log(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.MONGO_CLIENT_PASSWORD}@cluster0.oxsvm3u.mongodb.net/?retryWrites=true&w=majority`
);
mongoClient
  .connect()
  .then((client) => {
    console.log(client);
    app.listen(3000);
  })
  .catch(console.error);
