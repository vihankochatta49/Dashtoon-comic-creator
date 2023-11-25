const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const app = express();
const http = require("http").createServer(app);
const port = process.env.PORT || 3000;

//passport config
require("./config/passport")(passport);

//google auth config
require("./config/googleAuth");

//ejs engine
app.set("view engine", "ejs");

//body parser
app.use(express.urlencoded({ extended: false }));

//method override
app.use(methodOverride("_method"));

// Connecting with database
mongoose
  .connect("mongodb+srv://vihankochatta:Vihank%40123@vihan.c7ql4ep.mongodb.net/?retryWrites=true&w=majority"|| "mongodb://localhost:27017/blogs")
  .then(() => console.log("Connection successful..."))
  .catch((err) => console.log(err));


//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      expires: 1000000000000000,
    },
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//authentication with google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/feed",
    failureRedirect: "/auth/google/failure",
  })
);

//handles google auth fail
app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

//getting routes/new.js
app.use("/", require(path.join(__dirname, "routes/new")));

//getting routes/nav.js
app.use("/", require("./routes/nav"));

//getting routes/register.js
app.use("/", require("./routes/register"));


http.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
