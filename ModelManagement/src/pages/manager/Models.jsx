import { useState, useEffect } from 'react';
import { managerService } from '../../services/api';

const Models = () => {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNo: '',
        // Add the missing required fields
        addressLine1: '',
        addressLine2: '',
        zip: '',
        city: '',
        country: '',
        birthDate: '',
        nationality: '',
        height: '',
        shoeSize: '', // Note: API uses "shoeSize" not "shoes"
        hairColor: '',
        eyeColor: '',
        comments: ''
    });

    // Load models when component mounts
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await managerService.getModels();
                setModels(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load models: ' + (err.message || 'Unknown error'));
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Format the data according to the API's expected format
            // Note: ALL fields should be strings, not numbers
            const modelData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phoneNo: formData.phoneNo,
                addressLine1: formData.addressLine1 || "",
                addressLine2: formData.addressLine2 || "",
                zip: formData.zip || "",
                city: formData.city || "",
                country: formData.country || "",
                // Format birthDate as ISO string if provided
                birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : "",
                nationality: formData.nationality || "",
                // Keep all values as strings
                height: formData.height ? String(formData.height) : "",
                shoeSize: formData.shoeSize ? String(formData.shoeSize) : "",
                hairColor: formData.hairColor || "",
                eyeColor: formData.eyeColor || "",
                comments: formData.comments || ""
            };

            console.log("Submitting model data:", modelData);

            // Call the API to create a new model
            const response = await managerService.createModel(modelData);

            // Add the new model to the list
            setModels([...models, response.data]);

            // Reset the form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phoneNo: '',
                addressLine1: '',
                addressLine2: '',
                zip: '',
                city: '',
                country: '',
                birthDate: '',
                nationality: '',
                height: '',
                shoeSize: '',
                hairColor: '',
                eyeColor: '',
                comments: ''
            });

        } catch (err) {
            console.error("Create model error:", err.response?.data || err);
            setError('Failed to create model: ' + (err.response?.data || err.message || 'Unknown error'));
        }
    };

    return (
        <div className="models-page">
            <h1>Models</h1>

            {/* Create Model Form */}
            <div className="create-model-form">
                <h2>Create New Model</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <h3>Basic Information</h3>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name*</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name*</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNo">Phone Number*</label>
                        <input
                            type="text"
                            id="phoneNo"
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Address Information */}
                    <h3>Address Information</h3>
                    <div className="form-group">
                        <label htmlFor="addressLine1">Address Line 1</label>
                        <input
                            type="text"
                            id="addressLine1"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="addressLine2">Address Line 2</label>
                        <input
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="zip">ZIP/Postal Code</label>
                        <input
                            type="text"
                            id="zip"
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Personal Details */}
                    <h3>Personal Details</h3>
                    <div className="form-group">
                        <label htmlFor="birthDate">Birth Date</label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nationality">Nationality</label>
                        <input
                            type="text"
                            id="nationality"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Physical Characteristics */}
                    <h3>Physical Characteristics</h3>
                    <div className="form-group">
                        <label htmlFor="height">Height</label>
                        <input
                            type="text"
                            id="height"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            placeholder="e.g., 175"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="shoeSize">Shoe Size</label>
                        <input
                            type="text"
                            id="shoeSize"
                            name="shoeSize"
                            value={formData.shoeSize}
                            onChange={handleChange}
                            placeholder="e.g., 42"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="hairColor">Hair Color</label>
                        <input
                            type="text"
                            id="hairColor"
                            name="hairColor"
                            value={formData.hairColor}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="eyeColor">Eye Color</label>
                        <input
                            type="text"
                            id="eyeColor"
                            name="eyeColor"
                            value={formData.eyeColor}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comments">Comments</label>
                        <textarea
                            id="comments"
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <button type="submit" className="submit-button">Create Model</button>
                </form>
                <p className="form-note">* Required fields</p>
            </div>

            {/* Models List */}
            <div className="models-list">
                <h2>Models List</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="models-grid">
                        {models.length === 0 ? (
                            <p>No models available.</p>
                        ) : (
                            models.map((model) => (
                                <div key={model.id} className="model-card">
                                    <h3>{model.firstName} {model.lastName}</h3>
                                    <p>Email: {model.email}</p>
                                    <p>Phone: {model.phoneNo}</p>
                                    {/* Add more details or actions as needed */}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Models;