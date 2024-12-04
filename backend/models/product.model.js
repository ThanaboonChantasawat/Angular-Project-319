// models/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่อสินค้า'],
    minlength: [2, 'ชื่อสินค้าต้องมีอย่างน้อย 2 ตัวอักษร']
  },
  category: {
    type: String,
    required: [true, 'กรุณากรอกประเภทสินค้า'],
    minlength: [2, 'ประเภทสินค้าต้องมีอย่างน้อย 2 ตัวอักษร']
  },
  quantity: {
    type: Number,
    required: [true, 'กรุณากรอกจำนวนสินค้า'],
    min: [0, 'จำนวนสินค้าต้องไม่น้อยกว่า 0']
  },
  minQuantity: {
    type: Number,
    default: 5
  },
  status: {
    type: String,
    enum: ['in_stock', 'low_stock', 'out_of_stock'],
    default: 'in_stock'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);