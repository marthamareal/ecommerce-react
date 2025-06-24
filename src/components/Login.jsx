import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/AuthService';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';

        if (!password) newErrors.password = 'Password is required';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            //   Submit form to api
            try {
                const result = await loginUser({ email, password });
                const res = await result.json();
                if (!result.ok) setErrors({ general: res.message || "Login failed" })
                else {
                    // Save token  and admin status to localStorage
                    localStorage.setItem("token", res.accessToken);
                    localStorage.setItem("isAdmin", res.isAdmin);
                    navigate("/");
                }
            }
            catch (err) {
                console.log(err)
                setErrors({ general: "Network error. Please try again." })
            }

        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-16 sm:pt-24">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-6 relative">
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-sm text-indigo-500 hover:underline"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        <p className="mt-4 text-center text-sm text-gray-600">
                            <Link to="/forgot" className="text-indigo-600 hover:underline">Forgot password?</Link>
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200"
                    >
                        Login
                    </button>
                    {/* Display error here */}
                    {errors.general && <div className="flex justify-center mt-4">
                        <p className='text-red-600 text-justify text-sm mx-auto max-w-sm'>{errors.general}</p>
                    </div>}
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
