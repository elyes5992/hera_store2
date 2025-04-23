// src/models/categoryModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parentCategory?: mongoose.Types.ObjectId;
  isModified(path: string): boolean;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  },
  {
    timestamps: true
  }
);

// Create slug from name before saving
CategorySchema.pre('save', function(this: ICategory, next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }
  next();
});

export default mongoose.model<ICategory>('Category', CategorySchema);