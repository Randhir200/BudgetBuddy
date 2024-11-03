const mongoose = require('mongoose');
const { Schema } = mongoose

const balanceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentBalance: {
        type: Number,
        set: v => parseFloat(v.toFixed(2)),  // Rounds to two decimal places
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})


const Balance = mongoose.model('Balance', balanceSchema, 'Balance');

module.exports = Balance;