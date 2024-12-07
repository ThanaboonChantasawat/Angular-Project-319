// backend/controllers/user.controller.js
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username (case insensitive)
    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (!user) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
  }
};