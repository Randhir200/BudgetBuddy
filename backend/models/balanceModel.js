const mongoose = require('mongoose');
const {Schema} = mongoose

const balanceSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    currentBalance : {
        type : Number,
        default : 0
    }
})


const Balance = mongoose.model('Balance', balanceSchema, 'Balance');

module.exports = Balance;