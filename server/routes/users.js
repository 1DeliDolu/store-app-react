const express = require("express");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { get, add } = require("../data/users");

const router = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = { token, username: decoded.username };
    next();
  });
};

router.post("/login", async (req, res, next) => {
  try {
    const user = await get(req.body.username);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: user.username, email: user.email },
      "secret"
    );

    res.status(200).json({ token, username: user.username });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      firstname,
      lastname,
      street,
      houseNumber,
      postalCode,
      city,
      phone,
    } = req.body;

    // basic required fields validation
    if (
      !username ||
      !email ||
      !password ||
      !firstname ||
      !lastname ||
      !street ||
      !houseNumber ||
      !postalCode ||
      !city
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // German postal code validation (5 digits)
    if (!/^\d{5}$/.test(String(postalCode))) {
      return res.status(400).json({ message: "Invalid postal code (PLZ)" });
    }

    const user = await get(username);

    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      firstname,
      lastname,
      street,
      houseNumber,
      postalCode,
      city,
      phone: phone || null,
    };

    await add(newUser);
    // don't return password back to client
    const { password: _pw, ...safeUser } = newUser;
    res.status(201).json({ message: "User saved.", user: safeUser });
  } catch (error) {
    next(error);
  }
});

router.get("/getUser", verifyToken, async (req, res, next) => {
  try {
    const user = await get(req.user.username);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // return safe user profile (exclude password)
    const { password: _pwd, ...safe } = user;
    res.status(200).json({ ...safe, token: req.user.token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
