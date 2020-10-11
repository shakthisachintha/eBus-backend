const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    amount: {
        value: { type: Number, required: true },
        text: { type: String, required: true },
    },
    item: { type: String, required: true },
    reason: { type: Object, required: true },
    meta: { type: Object, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Transaction = mongoose.model("Transactions", transactionSchema);

module.exports = Transaction;
