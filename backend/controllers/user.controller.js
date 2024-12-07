// backend/controllers/user.controller.js
const User = require('../models/user.model');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check duplicate username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'มีชื่อผู้ใช้นี้ในระบบแล้ว' });
    }

    // Create new user
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
  }
};