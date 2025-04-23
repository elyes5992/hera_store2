// src/controllers/orderController.ts
import { Request, Response, NextFunction } from 'express';
import Order from '../models/orderModel';
import Product from '../models/productModel';
import { AppError } from '../Middlerware/errorHandler';
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;
    
    if (orderItems && orderItems.length === 0) {
      return next(new AppError('No order items', 400));
    }
    
    // Verify that all products exist and have sufficient stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return next(new AppError(`Product not found: ${item.product}`, 404));
      }
      
      if (product.stock < item.quantity) {
        return next(
          new AppError(`Not enough stock for ${product.name}. Available: ${product.stock}`, 400)
        );
      }
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
    }
    
    // Check if order belongs to user or user is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to access this order', 401));
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    
    // Filtering
    let query: any = {};
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by paid status
    if (req.query.isPaid) {
      query.isPaid = req.query.isPaid === 'true';
    }
    
    // Filter by delivered status
    if (req.query.isDelivered) {
      query.isDelivered = req.query.isDelivered === 'true';
    }
    
    // Execute query with pagination
    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'id name')
      .limit(limit)
      .skip(startIndex)
      .sort('-createdAt');
    
    // Pagination result
    const pagination = {
      total: count,
      pages: Math.ceil(count / limit),
      page,
      limit
    };
    
    res.status(200).json({
      success: true,
      pagination,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
    }
    
    // Verify user owns this order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this order', 401));
    }
    
    if (order.isPaid) {
      return next(new AppError('Order is already paid', 400));
    }
    
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address
    };
    
    const updatedOrder = await order.save();
    
    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
    }
    
    if (order.isDelivered) {
      return next(new AppError('Order is already delivered', 400));
    }
    
    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = 'delivered';
    
    const updatedOrder = await order.save();
    
    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
    }
    
    order.status = req.body.status;
    
    // If status is delivered, update isDelivered
    if (req.body.status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
    
    const updatedOrder = await order.save();
    
    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
    }
    
    await order.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};