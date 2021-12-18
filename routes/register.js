const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const rM = require(".././routes/registerModels");
const a = require(".././routes/models");

//register number
var registerNumber = Math.floor(Math.random() * 1000000000);

//profile route
router.get("/:name/:registerNumber", async (req, res) => {
  const userProfile = await rM.findOne({
    registerNumber: req.params.registerNumber,
  });
  res.render("index", { article: userProfile });
});

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check require fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill all fields" });
  }

  //password check
  if (password !== password2) errors.push({ msg: "Password do not match" });

  //check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters long" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    rM.findOne({ email: email }).then((user) => {
      if (user) {
        //User exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", { errors, name, email, password, password2 });
      } else {
        const createDoc = async function () {
          try {
            const userData = new rM({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              registerNumber: registerNumber,
            });

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            userData.password = hashedPassword;
            const user = await rM.insertMany([userData]);
            req.flash(
              "success_msg",
              "You have successfully registered and can login in"
            );
            res.redirect("/login");
          } catch (err) {
            console.log(err);
          }
        };
        createDoc();
      }
    });
  }
});

console.log(registerNumber);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/feed",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

module.exports = router;
