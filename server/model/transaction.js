const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    drugId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'drugs',
        required: true
    },
    drugName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    pricePerPack: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const TransactionDB = mongoose.model('transactions', transactionSchema);

module.exports = TransactionDB;
