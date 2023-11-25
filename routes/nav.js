const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const router = express.Router();

//home page
router.get("/", async (req, res) => {
  const profile = req.user;
  res.render("home", { profile});
});

//main page
router.get("/feed",ensureAuthenticated,async(req,res) => {
  const profile = req.user;
  res.render("feed",{profile});
})

module.exports = router;
