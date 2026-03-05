import React, { useState } from 'react';
import './Login.css';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const validate = () => {
		if (!email) {
			setError('Please enter your email.');
			return false;
		}
		const re = /\S+@\S+\.\S+/;
		if (!re.test(email)) {
			setError('Please enter a valid email address.');
			return false;
		}
		if (!password) {
			setError('Please enter your password.');
			return false;
		}
		setError('');
		return true;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;
		setLoading(true);
		// Mock submit: replace with real auth call
		setTimeout(() => {
			setLoading(false);
			alert(`Logged in as ${email} (mock)`);
		}, 800);
	};

	return (
		<div className="login-page">
			<div className="login-card">
				<h2>Sign in</h2>
				<form onSubmit={handleSubmit} className="login-form">
					<label>
						Email
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							autoComplete="username"
						/>
					</label>

					<label>
						Password
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter password"
							autoComplete="current-password"
						/>
					</label>

					{error && <div className="login-error">{error}</div>}

					<button type="submit" className="login-btn" disabled={loading}>
						{loading ? 'Signing in...' : 'Sign in'}
					</button>
				</form>

				<div className="login-footer">
					<span>Don't have an account?</span>
					<a href="#"> Sign up</a>
				</div>
			</div>
		</div>
	);
}
