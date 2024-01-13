/* export const publicRoutes = (req, res, next) => {
  if (!req.session.user) return res.redirect('/')
  next()
}

export const privateRoutes = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user?.role === 'user') return res.redirect('/profile')
    next()
  } else res.redirect('/')
}
 */
