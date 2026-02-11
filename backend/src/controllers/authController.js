const User = require('../models/User');
const Mechanic = require('../models/Mechanic');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, mobile, email, password, type } = req.body;

    const existingUser =
      await User.findOne({ email }) ||
      await Mechanic.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ MECHANIC REGISTER
    if (type === "mechanic") {
      const mechanic = new Mechanic({
        ...req.body,
        password: hashedPassword,
        type: "mechanic"
      });

      await mechanic.save();

      return res.json({
        success: true,
        user: mechanic
      });
    }

    // ✅ USER REGISTER
    const user = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
      type: "user"
    });

    await user.save();

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    const Model = type === "mechanic" ? Mechanic : User;
    const user = await Model.findOne({ email });

    if (!user)
      return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials" });

    res.json({
      success: true,
      user
    });

  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
