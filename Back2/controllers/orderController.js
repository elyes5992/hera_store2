// controllers/orderController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status;

    // If status is Delivered, also update delivered status
    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  
  // Build filters
  const filters = {};
  
  // Status filter
  if (req.query.status) {
    filters.status = req.query.status;
  }
  
  // Date range filter
  if (req.query.startDate && req.query.endDate) {
    filters.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    };
  }
  
  // Search by order ID
  if (req.query.orderId) {
    filters._id = req.query.orderId;
  }
  
  // Search by customer name/email
  if (req.query.customer) {
    // We need to find users first
    const users = await User.find({
      $or: [
        { name: { $regex: req.query.customer, $options: 'i' } },
        { email: { $regex: req.query.customer, $options: 'i' } },
      ],
    });
    
    const userIds = users.map(user => user._id);
    if (userIds.length > 0) {
      filters.user = { $in: userIds };
    }
  }

  const count = await Order.countDocuments(filters);
  const orders = await Order.find(filters)
    .populate('user', 'id name email')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await Order.deleteOne({ _id: order._id });
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get order statistics for dashboard
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
    // Get total revenue
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
  
    // Get revenue for the last 7 days
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
  
    const weeklyRevenue = await Order.aggregate([
      { 
        $match: { 
          isPaid: true, 
          createdAt: { $gte: lastWeek, $lte: today } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  
    // Get order counts by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    
  
    // Get recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
  
    res.json({
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      weeklyRevenue,
      ordersByStatus,
      recentOrders,
    });
  }


);


const toggleOrderPaidStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Toggle the isPaid status
    order.isPaid = !order.isPaid;

    // Update paidAt accordingly
    if (order.isPaid) {
      // If marked as paid, set the paidAt date
      order.paidAt = Date.now();
      // Optionally clear paymentResult if it was tied to a specific system like PayPal
      // order.paymentResult = undefined;
    } else {
      // If marked as unpaid, clear the paidAt date
      order.paidAt = undefined; // Or null
       // Optionally clear paymentResult
       // order.paymentResult = undefined;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);

  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getTotalRevenue = asyncHandler(async (req, res) => {
  console.log("Attempting to get total revenue only..."); // Add log
  try {
      const revenueResult = await Order.aggregate([
          { $match: { isPaid: true } }, // Filter for paid orders
          { $group: { _id: null, total: { $sum: '$totalPrice' } } }, // Sum totalPrice
      ]);

      const calculatedTotalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
      console.log("Calculated Total Revenue:", calculatedTotalRevenue);

      // Send response with only the totalRevenue
      res.json({ totalRevenue: calculatedTotalRevenue });

  } catch (error) {
      console.error("!!! SERVER ERROR IN getTotalRevenue !!!:", error);
      res.status(500);
      throw new Error(`Server Error calculating total revenue: ${error.message}`);
  }
});

const getTotalOrdersCount = asyncHandler(async (req, res) => {
  console.log('Attempting to get total orders count...'); // Add log
  const totalOrders = await Order.countDocuments({}); // Count all documents

  if (typeof totalOrders === 'number') { // Check if countDocuments returned a number
    console.log(`Calculated Total Orders Count: ${totalOrders}`); // Add log
    res.status(200).json({ totalOrders }); // Send count in an object
  } else {
    // This case is unlikely with countDocuments but good practice
    console.error('Failed to calculate total orders count.');
    res.status(500);
    throw new Error('Could not retrieve total order count');
  }
});



module.exports = {
  createOrder,
  toggleOrderPaidStatus,
  getOrderStats,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  deleteOrder,
  getTotalRevenue,
  updateOrderStatus,
  getTotalOrdersCount,
};