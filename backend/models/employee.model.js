const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  position: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: Boolean, default: true }
});

module.exports = mongoose.model('Employee', employeeSchema);