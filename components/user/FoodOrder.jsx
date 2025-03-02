
import '../styles/FoodManagement.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const FoodOrder = () => {
    const [foods, setFoods] = useState([]);
    const [newFood, setNewFood] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        image: null,
    });

    const [editFood, setEditFood] = useState(null);
    const [preview, setPreview] = useState('');

    const categories = ['Starter', 'Main Course', 'Dessert', 'Beverage'];

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        try {
            const res = await axios.get('http://localhost:5000/get-foods');
            setFoods(res.data);
        } catch (error) {
            console.error('Failed to fetch foods', error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newFood.name);
        formData.append('category', newFood.category);
        formData.append('price', newFood.price);
        formData.append('description', newFood.description);
        formData.append('image', newFood.image);

        try {
            await axios.post('http://localhost:5000/add-food', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchFoods();
            setNewFood({ name: '', category: '', price: '', description: '', image: null });
            setPreview('');
            alert('Food added successfully');
        } catch (error) {
            console.error('Failed to add food', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewFood({ ...newFood, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewFood({ ...newFood, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Left Column: Add Form */}
                <div className="col-md-5">
                    <h4 className="mb-4">{editFood ? 'Edit Food' : 'Add New Food'}</h4>
                    <form onSubmit={handleAdd} encType="multipart/form-data">
                        <input
                            type="text"
                            className="form-control mb-3"
                            name="name"
                            value={newFood.name}
                            onChange={handleChange}
                            placeholder="Food Name"
                            required
                        />

                        <select
                            className="form-select mb-3"
                            name="category"
                            value={newFood.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            className="form-control mb-3"
                            name="price"
                            value={newFood.price}
                            onChange={handleChange}
                            placeholder="Price"
                            required
                        />

                        <textarea
                            className="form-control mb-3"
                            name="description"
                            value={newFood.description}
                            onChange={handleChange}
                            placeholder="Description"
                            required
                        ></textarea>

                        <input
                            type="file"
                            className="form-control mb-3"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {preview && (
                            <div className="text-center mb-3">
                                <img src={preview} alt="Preview" className="img-thumbnail" style={{ width: '150px' }} />
                            </div>
                        )}

                        <button type="submit" className="btn btn-success w-100">
                            Add Food
                        </button>
                    </form>
                </div>

                {/* Right Column: Food Management Table */}
                <div className="col-md-7">
                    <h4 className="mb-4">Food List</h4>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foods.map((food) => (
                                <tr key={food.id}>
                                    <td>{food.name}</td>
                                    <td>{food.category}</td>
                                    <td>₹{food.price}</td>
                                    <td>
                                        {food.image_url && (
                                            <img
                                                src={`http://localhost:5000/uploads/${food.image_url}`}
                                                alt={food.name}
                                                style={{ width: '50px', height: '50px', borderRadius: '8px' }}
                                            />
                                        )}
                                    </td>
                                    <td className="d-flex" style={{padding:'auto'}}>
                                        <button className="btn btn-warning btn-sm me-2">Edit</button>
                                        <button className="btn btn-danger btn-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FoodOrder;
