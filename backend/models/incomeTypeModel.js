const mongoose = require('mongoose');

const incomeTypeSchema = new mongoose.Schema({
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

incomeTypeSchema.index({userId : 1, type:1}, {unique:true});

const IncomeType = mongoose.model('IncomeType', incomeTypeSchema, 'IncomeType');

module.exports = IncomeType;