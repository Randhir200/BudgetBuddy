const mongoose = require('mongoose');
const {Schema} = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
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
    required: true
  },
  categories: [categorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt field
expenseTypeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Config = mongoose.model('Config', expenseTypeSchema, 'Config');

module.exports = Config;
