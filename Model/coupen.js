const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true // Each coupon code should be unique
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'], // Type of discount (percentage or fixed amount)
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: Date,
    
  },
  maxUses: {
    type: Number,
    default: null // Maximum number of times a coupon can be used (null for unlimited)
  },
  currentUses: {
    type: Number,
    default: 0 // Number of times the coupon has been used
  },
  active: {
    type: Boolean,
    default: true // Whether the coupon is currently active or not 
  },
  minOrder: {
    type: Number,
    default: 100 // Whether the coupon is currently active or not
  }
});

const Coupon = mongoose.model('Coupon', couponSchema); 

module.exports = Coupon;
