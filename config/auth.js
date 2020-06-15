module.exports = {

  ensureAuthenticated: function(req, res, next) {

    console.log(req.session)

    if (req.user) {
      console.log("sas")
      return next();
    }

    req.flash('error_msg', 'Please log in to view that resource');

    res.send('AUTH-FALSE')
  },

  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/log-in');      
  }
};
