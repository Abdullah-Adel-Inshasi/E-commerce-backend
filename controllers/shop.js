const Cart = require("../models/cart");
const { Product } = require("../models/product");

exports.getProducts = (_req, res, _next) => {
  Product.findAll()
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
  Product.findByPk(productId).then((product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: `Product Details`,
      path: `/products/:id`,
    });
  });
};

exports.getIndex = (_req, res, _next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch(console.error);
};

exports.getCart = (req, res, _next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((cartItems) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        cartItems,
      });
    })
    .catch(console.error);
};

exports.postCart = (req, res, _next) => {
  const { productId } = req.body;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        newQuantity += product.cartItem.quantity;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch(console.error);
};

exports.getOrders = (_req, res, _next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
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
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch(console.error);
};

exports.postOrder = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          return req.user
            .createOrder()
            .then((order) => {
              order.addProducts(
                products.map((product) => {
                  product.orderItem = { quantity: product.cartItem.quantity };
                  return product;
                })
              );
            })
            .then((result) => {
              return cart.setProducts(null);
            });
        })
        .catch(console.error);
    })
    .then((result) => {
      console.log({ result });
      res.redirect("/cart");
    })
    .catch(console.error);
};
