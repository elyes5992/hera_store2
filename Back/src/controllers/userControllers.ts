// src/controllers/userController.ts

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import UserModel, { IUser } from '../models/userModule'; // Use UserModel
import { AppError } from '../Middlerware/errorHandler'; // Adjust path if needed
// import { sendEmail } from '../utils/sendEmail'; // Assuming you have an email utility

// --- Helper Function to Send Token Response ---
// (Sends JWT as a cookie)
const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options: any = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || '30', 10) * 24 * 60 * 60 * 1000 // Default 30 days
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Remove password from output (although it should be selected: false)
  const userOutput = user.toObject();
  delete userOutput.password;
  // Also remove reset token fields if they exist
  delete userOutput.resetPasswordToken;
  delete userOutput.resetPasswordExpire;


  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token, // Optionally send token in body too (e.g., for mobile clients)
      data: userOutput,
    });
};


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation (consider using express-validator middleware)
    if (!name || !email || !password) {
        return next(new AppError('Please provide name, email, and password', 400));
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email already registered', 400));
    }

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password, // Hashing is handled by the pre-save hook
      role, // Will default to 'user' if not provided and valid
    });

    sendTokenResponse(user, 201, res); // 201 Created

  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validate email & password exist
    if (!email || !password) {
      return next(new AppError('Please provide an email and password', 400));
    }

    // Check for user and explicitly select password
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return next(new AppError('Invalid credentials', 401)); // Use 401 Unauthorized
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);

  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear the cookie by setting an expired one with the same options
    const options: any = {
        expires: new Date(Date.now() - 10 * 1000), // Expire 10 seconds ago
        httpOnly: true,
    };
     if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(200).cookie('token', 'none', options).json({
        success: true,
        data: {},
    });
  } catch(error) {
      next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/profile
// @access  Private (requires protect middleware)
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user should be attached by the 'protect' middleware
    if (!req.user) {
         return next(new AppError('User not found or not authenticated', 404));
    }

    // Fetch fresh user data (optional, req.user might suffice if up-to-date)
    const user = await UserModel.findById(req.user.id);

    if (!user) {
       return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details (name, email)
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
     if (!req.user) {
         return next(new AppError('User not found or not authenticated', 404));
    }
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const { name, email } = req.body;

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email; // Consider email uniqueness check/verification

    await user.save(); // Triggers validators

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    // Handle potential validation errors (e.g., duplicate email)
    next(error);
  }
};

// @desc    Forgot password - Generate token & send email
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
        return next(new AppError('Please provide an email', 400));
    }

    const user = await UserModel.findOne({ email });

    // IMPORTANT: Always send a success response, even if user not found,
    // to prevent email enumeration attacks.
    if (user) {
      // Get reset token (method saves hashed token & expiry to user)
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false }); // Save token fields without full validation

      // Create reset URL (adjust frontend URL)
      const resetUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/auth/resetpassword/${resetToken}`; // TODO: Use Frontend URL

      const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

      try {
        // --- !!! Placeholder for sending email !!! ---
        // await sendEmail({
        //   email: user.email,
        //   subject: 'Password Reset Token',
        //   message,
        // });
        console.log('Password Reset Email Sent (Simulated):');
        console.log('To:', user.email);
        console.log('Subject: Password Reset Token');
        console.log('Message:', message);
        // --- End Placeholder ---

        res.status(200).json({ success: true, data: 'Email sent' });

      } catch (err) {
        console.error('Email sending error:', err);
        // Clear token fields if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Email could not be sent', 500));
      }
    } else {
       // Still send success even if user doesn't exist
       res.status(200).json({ success: true, data: 'Email sent' });
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return next(new AppError('Invalid or expired token', 400));
    }

    // Set new password
    if (!req.body.password) {
        return next(new AppError('Please provide a new password', 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined; // Clear the token fields
    user.resetPasswordExpire = undefined;
    await user.save(); // Pre-save hook will hash the new password

    // Log the user in automatically after password reset
    sendTokenResponse(user, 200, res);

  } catch (error) {
    next(error);
  }
};


// --- Admin Routes ---
// (These routes should be protected by 'protect' and 'authorize('admin')' middleware)

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return next(
        new AppError(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (by Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.params.id);

     if (!user) {
      return next(
        new AppError(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Fields admin can update
    const { name, email, role } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;

    // Note: Admin cannot directly update password here. Use a separate mechanism if needed.

    const updatedUser = await user.save();

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.params.id);

     if (!user) {
      return next(
        new AppError(`User not found with id of ${req.params.id}`, 404)
      );
    }

    await user.deleteOne(); // Or UserModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} }); // Or { success: true, message: 'User deleted' }
  } catch (error) {
    next(error);
  }
};