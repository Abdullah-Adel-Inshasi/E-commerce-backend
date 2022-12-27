// const Cart = require("../models/cart");
const { Product } = require("../models/product");
const { User } = require("../models/user");
exports.getProducts = (_req, res, _next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch(console.error);
};

exports.getProduct = (req, res, _next) => {
  const { productId } = req.params;
  Product.findById(productId).then((product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: `Product Details`,
      path: `/products/:id`,
    });
  });
};

exports.getIndex = (_req, res, _next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch(console.error);
};

exports.getCart = async (req, res, _next) => {
  const cartItems = await req.user.getCart();
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    cartItems,
  });
};

exports.postCart = (req, res, _next) => {
  const { productId } = req.body;
  req.user.addToCart(productId).then(() => {
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, _next) => {
  req.user.getOrders({ include: "products" }).then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders,
    });
  });
};

exports.getCheckout = (_req, res, _next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postDeleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteItemFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch(console.error);
};

exports.postOrder = (req, res, next) => {
  req.user.createOrder().then(() => {
    res.redirect("/cart");
  });
};
