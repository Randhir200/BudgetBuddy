const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const expenseTypeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
  },
  categories: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: ''
      },
      isActive: {
        type: Boolean,
        default: true
      },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for userId and type with categories name to ensure no duplicates
expenseTypeSchema.index({ userId: 1, type: 1 }, { unique: true });



// Middleware to update the updatedAt field
expenseTypeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const ExpenseType = mongoose.model('ExpenseType', expenseTypeSchema, 'ExpenseType');

module.exports = ExpenseType;
