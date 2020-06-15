module.exports = {

  ensureAuthenticated: function(req, res, next) {

    if (req.isAuthenticated()) {
      return next();
    }

    res.send('AUTH-FALSE')
  },

  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/log-in');      
  }
};
