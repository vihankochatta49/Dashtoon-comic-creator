//check if user is authenticated or not
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash("error_msg", "Please login to view this page");
    res.redirect("/login");
  },
};
