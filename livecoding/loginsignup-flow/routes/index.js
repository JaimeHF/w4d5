const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Users = require("../models/Users");

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

// log user
router.post("/log-user", (req, res, next) => {
  if (req.body.username.trim() === "" || req.body.password.trim() === "") {
    res.json({
      error: true,
      msg: "Username or password are empty"
    });

    return;
  }

  Users.findOne({ username: req.body.username }).then((foundUser) => {
    if (foundUser) {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        // user is ok and password is ok
        res.json({
          error: false,
          msg: "Logged in, yay!",
          when: new Date()
        });
      } else {
        // user is ok but password is not ok
        res.json({
          error: true,
          msg: "Password is not ok"
        });
      }
    } else {
      res.json({
        error: true,
        msg: "User not found"
      });
    }
  });
});

router.post("/create-user", (req, res, next) => {
  if (req.body.username.trim() === "" || req.body.password.trim() === "") {
    res.json({
      error: true,
      msg: "Username or password are empty"
    });

    return;
  }

  Users.findOne({ username: req.body.username }).then((foundUser) => {
    if (foundUser) {
      res.json({
        error: true,
        msg: "Username already taken"
      });

      return;
    } else {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(req.body.password, salt);

      // res.json({
      //   username: req.body.username,
      //   password: req.body.password,
      //   hashedPassword: hash
      // });

      Users.create({
        username: req.body.username,
        password: hash,
        role: "admin"
      }).then(() => {
        res.json({
          userCreated: true,
          timestamp: new Date()
        });
      });
    }
  });
});

router.get("/private", (req, res) => {
  res.render("private");
});

module.exports = router;
