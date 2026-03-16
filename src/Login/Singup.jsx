import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/api"
import Swal from "sweetalert2";

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // validation
    const validate = () => {

        if (!formData.name) {
            setError("Please enter your name");
            return false;
        }

        if (!formData.email) {
            setError("Please enter your email");
            return false;
        }

        const re = /\S+@\S+\.\S+/;

        if (!re.test(formData.email)) {
            setError("Please enter valid email");
            return false;
        }

        if (!formData.password) {
            setError("Please enter password");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        setError("");
        return true;
    };

    // submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {

            const response = await signUp(formData);

            // console.log(response);
            setLoading(false);
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "user"

            });


            Swal.fire({
                title: "Success",
                text: "User created successfully",
                icon: "success"
            }).then(() => {
                navigate("/login");
            });

        } catch (error) {

            console.log(error);

        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <h2>Sign up</h2>

                <form onSubmit={handleSubmit} className="login-form">

                    <label>
                        Name
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                        />
                    </label>
                    

                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="password"
                        />
                    </label>

                    <label>
                        Confirm Password
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                        />
                    </label>

                    <label>
                        Select Role
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="user">User</option>
                            <option value="technician">Technician</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Signing up..." : "Sign up"}
                    </button>

                </form>

                <div className="login-footer">
                    <span>Already have an account?</span>
                    <Link to="/login"> Login</Link>
                </div>

            </div>
        </div>
    );
}