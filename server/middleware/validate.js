function validateBody(rules) {
  return (req, res, next) => {
    const errors = rules.map(rule => rule(req.body)).filter(Boolean);
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    next();
  };
}

const required = (field, label) => body => !String(body[field] || '').trim() && `${label} is required.`;
const email = body => body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) && 'Enter a valid email address.';
const password = body => body.password && body.password.length < 6 && 'Password must be at least 6 characters.';
const phone = body => body.phone && !/^\+?[0-9\s()-]{7,20}$/.test(body.phone) && 'Enter a valid phone number.';
const positiveNumber = field => body => (body[field] !== undefined && (!Number.isFinite(Number(body[field])) || Number(body[field]) <= 0)) && `${field} must be a positive number.`;

module.exports = { validateBody, required, email, password, phone, positiveNumber };