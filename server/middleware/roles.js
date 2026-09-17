function roleRequired(role) { return (req, res, next) => { if (req.staff?.role !== role) return res.status(403).json({ message: `${role} access required.` }); next(); }; }
const isStaff = roleRequired('staff');
const isMember = roleRequired('member');
module.exports = { isStaff, isMember };