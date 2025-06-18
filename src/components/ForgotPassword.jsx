import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/AuthService';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("")

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
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
                const result = await forgotPassword({ email });
                const res = await result.json();
                if (!result.ok) setErrors({ general: res.message })
                else {
                    setMessage(res.message);
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
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Forgot Password</h2>
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
                    {/* Display Messages here */}
                    {message && <div className="flex justify-center mt-4 mb-4">
                        <p className='text-green-600 text-justify text-sm mx-auto max-w-sm'>{message}</p>
                    </div>}
                    {errors.general && <div className="flex justify-center mt-4 mb-4">
                        <p className='text-red-600 text-justify text-sm mx-auto max-w-sm'>{errors.general}</p>
                    </div>}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200"
                    >
                        Send
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    <Link to="/login" className="text-indigo-600 hover:underline">Login / </Link>
                    <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
