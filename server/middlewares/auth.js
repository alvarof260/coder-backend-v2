export const handlePolicies = (policies) => (req, res, next) => {
  if (policies.includes('PUBLIC')) return next()
  if (!req.user) return res.status(401).redirect('/')
  if (policies.length > 0) {
    if (!policies.includes(req.user.role.toUppercase())) {
      return res.status(401).json({ status: 'unauthorized', error: 'you are not authorized to perform this action' })
    }
  }
}
