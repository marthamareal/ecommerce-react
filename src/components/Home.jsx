import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addOrUpdateCart, fetchCategories, fetchProducts } from '../services/ProductService';

const slides = [
    {
        id: 1,
        image: '/images/one.png',
        headline: 'Big Summer Sale!',
        description: 'Up to 50% off on selected items.',
    },
    {
        id: 2,
        image: '/images/new.jpg',
        headline: 'New Arrivals',
        description: 'Check out the latest gadgets and accessories.',
    },
    {
        id: 3,
        image: '/images/blackf.png',
        headline: 'Free Shipping',
        description: 'On all orders over $50.',
    },
];

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getCategories = async () => {
            try {
                const result = await fetchCategories()
                const data = await result.json();
                if (result.status == 200) setCategories(data);
            }
            catch (err) {
                console.log(err)
                setError(err.message)
            }
        }
        getCategories();
    }, []);

    useEffect(() => {
        const getFeaturedProducts = async () => {
            try {
                const result = await fetchProducts()
                const data = await result.json();
                if (result.status == 200) {
                    // Filter featured products. NOTE: To be changed when backend implements filter on products route
                    const featuredProducts = data.filter((prod) => prod.featured == true)
                    setFeaturedProducts(featuredProducts);
                }
            }
            catch (err) {
                console.log(err)
                setError(err.message)
            }
        }
        getFeaturedProducts();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const addToCart = async (productId, qty = 1) => {
        // Add to cart with API
        try {
            await addOrUpdateCart({ productId: productId, quantity: qty })
            navigate("/cart")

        }
        catch (err) {
            console.log(err)
            setError(err.message)
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section with Slider */}
            <section className="relative w-full max-w-7xl mx-auto my-12 rounded-lg overflow-hidden shadow-lg h-[350px] lg:h-[400px]">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-20' : 'opacity-0 z-10'
                            }`}
                    >
                        <img
                            src={slide.image || '/images/no-img.png'}
                            alt={slide.headline}
                            className="w-full h-full object-cover"
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                        {/* Content inside slide */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center lg:items-start max-w-xl px-6 lg:px-12 text-center lg:text-left text-white z-30">
                            <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">{slide.headline}</h1>
                            <p className="mb-6 text-lg drop-shadow-md">{slide.description}</p>
                            <div className="flex gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/"
                                    className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-md font-semibold drop-shadow-md"
                                >
                                    Shop Now
                                </Link>
                                <Link
                                    to="/"
                                    className="border border-white hover:border-indigo-300 px-6 py-3 rounded-md font-semibold drop-shadow-md"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-40">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-3 h-3 rounded-full ${idx === currentSlide ? 'bg-indigo-600' : 'bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="my-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {featuredProducts.map(({ id, name, price, image }) => (
                        <div
                            key={id}
                            className="bg-white border shadow-sm rounded-lg p-4 hover:shadow-md transition flex flex-col"
                        >
                            <Link to={`/products/${id}`} className="flex-1">
                                <img
                                    src={image || '/images/no-img.png'}
                                    alt={name}
                                    className="w-full h-32 object-cover mb-4 rounded"
                                />
                                <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
                                <p className="text-indigo-600 font-bold mt-1">${price}</p>
                            </Link>

                            <button
                                onClick={() => addToCart(id)}
                                className="mt-3 w-full bg-indigo-600 text-white py-1.5 rounded hover:bg-indigo-700 transition"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="my-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
                <div className="flex justify-center gap-8 flex-wrap">
                    {categories.map(({ id, name }) => (
                        <Link
                            to={`/products?category=${name.toLowerCase()}`}
                            key={id}
                            className="w-40 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                        >
                            <div className="p-3 text-center font-semibold text-gray-700">{name}</div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-indigo-50 py-12 rounded-lg text-center max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                <p className="mb-6 text-gray-600">Get the latest deals and updates right in your inbox.</p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        alert('Subscribed!');
                    }}
                    className="flex flex-col sm:flex-row justify-center gap-4 px-4"
                >
                    <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 flex-grow"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-semibold"
                    >
                        Subscribe
                    </button>
                </form>
            </section>
        </div>
    );
}
