const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const { loginValidate, registerValidate } = require('../controller/validate')

const addUser = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const comparePassword = await bcrypt.compare(confirm_password, encryptedPassword);

    // Validate sign up form
    const { error } = registerValidate(req.body);
    if (error) return res.status(400).send({ error: error.message });

    const oldUser = await User.findOne({ email });

    // Verifying if user already exist and if the passwords match
    if (oldUser) {
        return res.status(400).send({ error: "User already exists" });
    } else if (!comparePassword) {
        return res.status(400).send({ error: "Passwords didn't match" })
    }

    const user = new User({
        name,
        email,
        password: encryptedPassword
    })

    try {
        await user.save();
        res.status(200).send({ msg: "User created successfully" })
    } catch (error) {
        res.status(400).send(error);
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const { error } = loginValidate(req.body);
    if (error) return res.status(400).send({ error: error.message });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: "Email or Password incorrect" });

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) return res.status(400).send({ error: "Email or Password incorrect" });

    try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE);
        res.status(200).send({ msg: "User is logged", token });
    } catch (error) {
        res.send(error)
    }
}

const userDate = async (req, res) => {
    const { token } = req.body;
    const userVerify = jwt.verify(token, process.env.JWT_SECRETE);
    const userID = userVerify.id

    try {
        const user = await User.findOne({ _id: userID });
        res.send({ name: user.name, email: user.email })
    } catch (error) {
        res.send(error)
    }
}

module.exports = { addUser, loginUser, userDate }