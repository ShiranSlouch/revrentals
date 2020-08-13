exports.checkAuthAndMaybeRedirect = (req, res, next) => {
  if (!req.user) {
    res.redirect("/login")
    return;
  }
  next()
}


exports.adminOrSuperadminRequired = (req, res, next) => {

  if (!req.isAuthenticated()){
    return res.redirect('/login')
  }
  if (!req.user.is_admin && !req.user.is_super_admin) {
    return res.redirect('/menu')
  }
  next()
}

exports.adminRequired = (req, res, next) => {
  
  if (!req.isAuthenticated()){
    return res.redirect('/login')
  }
  if (!req.user.is_admin ) {
    return res.redirect('/menu')
    return //res.render("403")//
  }
  next()
}

exports.ifAuthenticatedRedirectToMenu = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/menu")
  }
  next()
}

