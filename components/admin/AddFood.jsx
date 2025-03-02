import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddFood = () => {
    const [foods, setFoods] = useState([]);
    const [newFood, setNewFood] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
    });

    const [editFood, setEditFood] = useState(null);
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

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();

        const foodData = {
            name: newFood.name,
            category: newFood.category,
            price: newFood.price,
            description: newFood.description,
        };

        try {
            if (editFood) {
                await axios.put(`http://localhost:5000/update-food/${editFood.id}`, foodData);
                toast.success('Food updated successfully');
            } else {
                await axios.post('http://localhost:5000/add-food', foodData);
                toast.success('Food added successfully');
            }
            fetchFoods();
            resetForm();
        } catch (error) {
            console.error('Failed to save food', error);
        }
    };

    const handleEdit = (food) => {
        setEditFood(food);
        setNewFood({
            name: food.name,
            category: food.category,
            price: food.price,
            description: food.description,
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this food item?')) {
            try {
                await axios.delete(`http://localhost:5000/delete-food/${id}`);
                fetchFoods();
                toast.success('Food deleted successfully');
            } catch (error) {
                console.error('Failed to delete food', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewFood({ ...newFood, [name]: value });
    };

    const resetForm = () => {
        setNewFood({ name: '', category: '', price: '', description: '' });
        setEditFood(null);
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Left Column: Add/Edit Form */}
                <div className="col-md-5">
                    <h4 className="mb-4">{editFood ? 'Edit Food' : 'Add New Food'}</h4>
                    <form onSubmit={handleAddOrUpdate}>
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
                            
                        ></textarea>

                        <button type="submit" className="btn btn-success w-100">
                            {editFood ? 'Update Food' : 'Add Food'}
                        </button>
                        {editFood && (
                            <button type="button" className="btn btn-secondary w-100 mt-2" onClick={resetForm}>
                                Cancel Edit
                            </button>
                        )}
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foods.map((food) => (
                                <tr key={food.id}>
                                    <td>{food.name}</td>
                                    <td>{food.category}</td>
                                    <td>₹{food.price}</td>
                                    <td className="d-flex gap-2">
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleEdit(food)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(food.id)}
                                        >
                                            Delete
                                        </button>
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

export default AddFood;
