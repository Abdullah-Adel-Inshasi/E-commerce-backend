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
  // const product = Product.findById(productId);
  Product.findById(productId).then((product) => {
    if (product === null) {
      res.redirect("/admin/products");
    } else {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        isEditing: true,
        product,
      });
    }
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const { id } = req.body;

  Product.deleteProduct(id)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(console.error);
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, imageUrl, price, description } = req.body;
  const product = new Product(title, price, description, imageUrl, id);
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      res.redirect("/admin/edit-product/:productId?editMode=true");
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    req.user._id
  );
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(() => {
      res.redirect("/admin/add-product");
    });
};

exports.getProducts = async (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
