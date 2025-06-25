import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addProduct, fetchCategories } from '../services/ProductService';

export default function AddProduct() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState("")
    const [description, setDescription] = useState('');
    const [featured, setFeatured] = useState(false);
    const [categories, setCategories] = useState([])
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'Name is required';
        if (!price) newErrors.price = 'Price is required';
        if (!categoryId) newErrors.category = 'Category is required';
        return newErrors;
    };
    useEffect(() => {
        const getCategories = async () => {
            try {
                const result = await fetchCategories()
                const data = await result.json();
                if (result.status == 200) setCategories(data);
                // Set default category selection
                if (categories.length > 0 && !categoryId) {
                    setCategoryId(categories[0].id);
                }
            }
            catch (err) {
                console.log(err)
                setErrors(err.message)
            }
        }
        getCategories();
    }, [categories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            console.log(validationErrors)
            setErrors(validationErrors);
        } else {
            setErrors({});
            // Submit data to backend here (API call)
            try {
                const result = await addProduct({ name, price, categoryId, description, featured });
                const data = await result.json();
                if (result.status != 201) {
                    const general = data?.message
                    setErrors({ general })
                }
                else {
                    navigate(`/products/${data.id}`)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-10 pt-8 pb-10 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Create Product</h2>

                {errors.general && (
                    <p className="text-red-500 text-sm mt-1 text-center">{errors.general}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Price</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
                            value={price}
                            onChange={(e) => setPrice(parseInt(e.target.value))}
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => { setCategoryId(parseInt(e.target.value)) }}
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {categories.map((category) => (
                                <option value={category.id} key={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Featured Checkbox */}
                    <div className="mb-4 flex items-center">
                        <input
                            id="featured"
                            type="checkbox"
                            checked={featured}
                            onChange={(e) => setFeatured(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                            Mark as Featured
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}
