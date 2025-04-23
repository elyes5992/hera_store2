// src/models/userModel.ts
import mongoose, { Document, Schema, Model } from 'mongoose'; // Added Model type
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken'; // Import SignOptions
import crypto from 'crypto';

// Interface defining the instance methods (for type safety on documents)
export interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
}

// Interface defining the document structure (properties) and extending Document and IUserMethods
export interface IUser extends Document, IUserMethods {
  name: string;
  email: string;
  password: string; // Password will be selected: false in schema but needed here
  role: 'user' | 'admin'; // Use union type for role
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  // Timestamps added by schema option
  createdAt: Date;
  updatedAt: Date;
  // _id is inherited from Document
}

// Define the Schema using the IUser properties
// Note: We don't include methods in the Schema definition itself
const UserSchema: Schema<IUser, Model<IUser, {}, IUserMethods>, IUserMethods> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// --- Middleware ---

// Encrypt password using bcrypt before saving
// Explicitly type 'this' as IUser within the hook
UserSchema.pre<IUser>('save', async function(this: IUser, next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return next(); // Skip hashing if password hasn't changed
  }

  // Hash the password
  try {
    const salt = await bcrypt.genSalt(10);
    // 'this.password' is known to be a string here due to the IUser type on 'this'
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Proceed with saving
  } catch (error: any) { // Catch potential errors during hashing/salting
     // Ensure the error is passed correctly, potentially wrapping it
     const err = error instanceof Error ? error : new Error('Password hashing failed');
     next(err); // Pass the error to Mongoose/next middleware
  }
});

// --- Instance Methods ---

// Sign JWT and return
// Add explicit type for 'this' and return type for clarity
UserSchema.methods.getSignedJwtToken = function(this: IUser): string {
  const secret: Secret | undefined = process.env.JWT_SECRET;
  const expireTime = process.env.JWT_EXPIRE;

  // --- Runtime Safety Checks (Highly Recommended) ---
  if (!secret) {
    console.error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
    // Throwing an error is appropriate here as JWTs cannot be signed.
    throw new Error('Server configuration error: JWT secret missing.');
  }

  // --- End Safety Checks ---

  const payload = { id: this._id }; // Use Mongoose _id

  // Define options explicitly with the correct type
  const options: SignOptions = {};

  // Only add expiresIn if the environment variable is set and valid
  if (expireTime) {
    options.expiresIn = expireTime as any; // Pass the string directly; jsonwebtoken library parses it.
  } else {
    // Optional: Provide a default expiration if JWT_EXPIRE is not set
     options.expiresIn = '1d'; // Example: default to 1 day
     console.warn('Warning: JWT_EXPIRE environment variable not defined. Using default JWT expiration: 1d');
  }

  // Now, call jwt.sign with guaranteed secret and well-typed options
  return jwt.sign(payload, secret, options);
};

// Match user entered password to hashed password in database
// Type 'this' explicitly for safety
UserSchema.methods.matchPassword = async function(this: Document & { password?: string }, enteredPassword: string): Promise<boolean> {
  // Need to ensure password field was selected if called outside of auth context
  if (!this.password) {
     // This might happen if the document was fetched without selecting the password
     console.error("Attempted to match password, but password field was not selected.");
     // Depending on context, you might throw or return false
     // Returning false might be misleading, throwing might be better server-side.
     throw new Error("Password field not available for comparison.");
     // return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};


// Generate and hash password token
// Type 'this' explicitly
UserSchema.methods.getResetPasswordToken = function(this: IUser): string {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire to 10 minutes from now
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken; // Return the unhashed token to be sent to the user
};

// --- Model Creation ---

// Define the Model type explicitly using the interfaces
const UserModel = mongoose.model<IUser, Model<IUser, {}, IUserMethods>>('User', UserSchema);

export default UserModel;