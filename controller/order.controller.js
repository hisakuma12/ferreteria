const Producto = require("../models/Producto");
const Order = require("../models/Order");

const ErrorHandler = require("../util/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//Create New Order -> api/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    person,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    person,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

//Get Single Order -> api/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(
      new ErrorHandler(`No order found with this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//! Falta
exports.getAllOrderUser = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById();
});

//Get All Order -> api/admin/orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//Update Order -> api/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  await order.save();

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Producto.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
