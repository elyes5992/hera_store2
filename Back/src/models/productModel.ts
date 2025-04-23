// src/models/productModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  stock: number;
  discountPercentage?: number;
  calculateAverageRating(): void;
  featured: boolean;
  averageRating: number;
  numReviews: number;
  reviews: Array<{
    user: mongoose.Types.ObjectId;
    name: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be above 0']
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please add a category']
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock count'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    discountPercentage: {
      type: Number,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100']
    },
    featured: {
      type: Boolean,
      default: false
    },
    averageRating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
        },
        comment: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create a virtual property for discounted price
ProductSchema.virtual('discountedPrice').get(function(this: any) {
  if (!this.discountPercentage) return this.price;
  
  const discountAmount = (this.price * this.discountPercentage) / 100;
  return this.price - discountAmount;
});

// Update average rating when reviews are modified
ProductSchema.methods.calculateAverageRating = function() {
  const product = this as IProduct;
  
  if (product.reviews.length === 0) {
    product.averageRating = 0;
    product.numReviews = 0;
    return;
  }
  
  const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
  product.averageRating = sum / product.reviews.length;
  product.numReviews = product.reviews.length;
};

ProductSchema.pre('save', function(this: mongoose.Document & IProduct, next) {
  if (this.isModified('reviews')) {
    this.calculateAverageRating();
  }
  next();
});

export default mongoose.model<IProduct>('Product', ProductSchema);