const { Product } = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isEditing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  const { editMode } = req.query;

  if (editMode !== "true") {
    res.redirect("/");
  }
  req.user.getProducts({ where: { id: productId } }).then((products) => {
    const product = products[0];
    if (product === null) {
      res.redirect("/");
    } else {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        isEditing: editMode,
        product,
      });
    }
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const { id } = req.body;

  req.user
    .getProducts({ where: { id } })
    .then((products) => {
      products[0].destroy();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(console.error);
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, imageUrl, price, description } = req.body;
  req.user
    .getProducts({ where: { id } })
    .then((products) => {
      products[0].title = title;
      products[0].imageUrl = imageUrl;
      products[0].price = price;
      products[0].description = description;
      products[0].save().then(() => {
        res.redirect("/");
      });
    })
    .catch(console.error);
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createProduct({
      title,
      imageUrl,
      price,
      description,
      userId: req.user.id,
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((x) => {
      console.error(x);
      res.redirect("404");
    });
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch(console.error);
};
