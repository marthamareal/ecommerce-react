import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/AuthService';

export default function Register() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 8 || !passwordRegex.test(password)) {
            newErrors.password = 'Password must be at least 6 characters and include uppercase, lowercase, number, and special character';
        }
        if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            // Submit data to backend here (API call)
            try {
                const result = await registerUser({ first_name, last_name, email, password });
                if (result.status != 201) {
                    const res = await result.json();
                    const registrationError = res?.message
                    setErrors({ registrationError })
                }
                else {
                    navigate("/login")
                }
            }
            catch (err) {
                console.log(err)
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Register</h2>
                {errors.registrationError && <p className="text-red-500 text-sm mt-1 text-center">{errors.registrationError}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

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
                    </div>
                    <div className="mb-6 relative">
                        <label className="block text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-sm text-indigo-500 hover:underline"
                            onClick={() => setShowConfirmPassword(!showPassword)}
                        >
                            {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
