import React, {  useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from "../services/api"
import { toast } from "react-toastify";

export default function Login() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();



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

	const handleSubmit = async (e) => {

		e.preventDefault();

		if (!validate()) return;

		setLoading(true);

		try {

			const response = await loginUser({
				email,
				password
			});

			if (response.token) {

				// token save
				localStorage.setItem("token", response.token);

				

	 				 toast.success("Login successful");

				// dashboard redirect
				navigate("/dashboard");

			} else {
					  toast.error(response.message || "Login failed");
				

				setError(response.message || "Login failed");

			}

		} catch (err) {

			setError("Something went wrong");

		}

		setLoading(false);

	};

	return (
		<div className="login-page">
			<div className="login-card">
				<h2>Login</h2>

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
						{loading ? 'Login...' : 'Login'}
					</button>

				</form>

				<div className="login-footer">
					<span>Don't have an account?</span>
					<Link to="/sign-up"> SignUp</Link>
				</div>

			</div>
		</div>
	);
}