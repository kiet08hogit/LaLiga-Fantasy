import jwt from 'jsonwebtoken';

export const oauthLoginController = (req, res) => {
	// Redirect to OAuth provider (Google, GitHub, etc.)
	// This will be handled by passport middleware
	res.json({ message: 'Redirecting to OAuth provider' });
};

export const oauthCallbackController = (req, res) => {
	// After successful authentication with Passport
	const token = jwt.sign(
		{ id: req.user.id, email: req.user.email },
		process.env.JWT_SECRET,
		{ expiresIn: '24h' }
	);
	res.json({ token, user: req.user });
};

export const logoutController = (req, res) => {
	res.json({ message: 'Logged out successfully' });
};
