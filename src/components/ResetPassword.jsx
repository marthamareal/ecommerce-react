import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../services/AuthService';

export default function Register() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { token } = useParams();

    const validate = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 8) {
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
                const result = await resetPassword(token, { password });
                const res = await result.json();
                if (result.status != 200) {
                    const resetError = res?.message
                    setErrors({ resetError })
                }
                else {
                    navigate("/login");
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
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Reset Password</h2>
                {errors.resetError && <p className="text-red-500 text-sm mt-1 text-center">{errors.resetError}</p>}
                <form onSubmit={handleSubmit}>
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
                        Reset
                    </button>
                </form>
            </div>
        </div>
    );
}
