import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';

const emptyModel = {
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
};

const ModelForm = ({
    initialData = {},
    onSubmit,
    submitButtonText = 'Create Model',
    isLoading = false,
    onCancel = null,
    hidePassword = false // For editing existing models
}) => {
    // Merge empty model with initialData
    const [formData, setFormData] = useState({
        ...emptyModel,
        ...initialData
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Update form if initialData changes (e.g. when editing different models)
    useEffect(() => {
        setFormData({
            ...emptyModel,
            ...initialData
        });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email ||
            (!hidePassword && !formData.password) || !formData.phoneNo) {
            setError('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            // Create a copy of form data, omitting password if hidePassword is true
            const submitData = { ...formData };

            // Format date if present
            if (submitData.birthDate) {
                submitData.birthDate = new Date(submitData.birthDate).toISOString();
            }

            // Ensure all values are strings for API
            Object.keys(submitData).forEach(key => {
                if (submitData[key] !== null && submitData[key] !== undefined) {
                    submitData[key] = String(submitData[key]);
                }
            });

            await onSubmit(submitData);

            setSuccess(initialData.modelId ? 'Model updated successfully!' : 'Model created successfully!');

            // Only reset if creating new model
            if (!initialData.modelId) {
                setFormData(emptyModel);
            }
        } catch (err) {
            setError('Error: ' + (err.message || err.toString() || 'Unknown error'));
        }
    };

    return (
        <div className="model-form-container card fade-in">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3 className="form-section-title">Basic Information</h3>
                    <div className="form-row">
                        <FormField
                            type="text"
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="Enter first name"
                        />

                        <FormField
                            type="text"
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Enter last name"
                        />
                    </div>

                    <FormField
                        type="email"
                        id="email"
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email address"
                    />

                    {!hidePassword && (
                        <FormField
                            type="password"
                            id="password"
                            name="password"
                            label="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                        />
                    )}

                    <FormField
                        type="tel"
                        id="phoneNo"
                        name="phoneNo"
                        label="Phone Number"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        required
                        placeholder="Enter phone number"
                    />
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Address Information</h3>
                    <FormField
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        label="Address Line 1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        placeholder="Street address"
                    />

                    <FormField
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        label="Address Line 2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        placeholder="Apartment, suite, etc. (optional)"
                    />

                    <div className="form-row">
                        <FormField
                            type="text"
                            id="zip"
                            name="zip"
                            label="ZIP/Postal Code"
                            value={formData.zip}
                            onChange={handleChange}
                            placeholder="Postal code"
                        />

                        <FormField
                            type="text"
                            id="city"
                            name="city"
                            label="City"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                        />
                    </div>

                    <FormField
                        type="text"
                        id="country"
                        name="country"
                        label="Country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Country"
                    />
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Personal Details</h3>
                    <div className="form-row">
                        <FormField
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            label="Birth Date"
                            value={formData.birthDate}
                            onChange={handleChange}
                            placeholder="Select date"
                        />

                        <FormField
                            type="text"
                            id="nationality"
                            name="nationality"
                            label="Nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            placeholder="Nationality"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Physical Characteristics</h3>
                    <div className="form-row">
                        <FormField
                            type="text"
                            id="height"
                            name="height"
                            label="Height (cm)"
                            value={formData.height}
                            onChange={handleChange}
                            placeholder="e.g., 175"
                        />

                        <FormField
                            type="text"
                            id="shoeSize"
                            name="shoeSize"
                            label="Shoe Size"
                            value={formData.shoeSize}
                            onChange={handleChange}
                            placeholder="e.g., 42"
                        />
                    </div>

                    <div className="form-row">
                        <FormField
                            type="text"
                            id="hairColor"
                            name="hairColor"
                            label="Hair Color"
                            value={formData.hairColor}
                            onChange={handleChange}
                            placeholder="e.g., Brown"
                        />

                        <FormField
                            type="text"
                            id="eyeColor"
                            name="eyeColor"
                            label="Eye Color"
                            value={formData.eyeColor}
                            onChange={handleChange}
                            placeholder="e.g., Blue"
                        />
                    </div>

                    <FormField
                        type="textarea"
                        id="comments"
                        name="comments"
                        label="Comments"
                        value={formData.comments}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Additional information about the model"
                    />
                </div>

                <div className="form-buttons">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-icon"></span>
                                Processing...
                            </>
                        ) : (
                            submitButtonText
                        )}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <p className="form-note">Fields marked with an asterisk (*) are required</p>
        </div>
    );
};

ModelForm.propTypes = {
    initialData: PropTypes.shape({
        modelId: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
        password: PropTypes.string,
        phoneNo: PropTypes.string,
        addressLine1: PropTypes.string,
        addressLine2: PropTypes.string,
        zip: PropTypes.string,
        city: PropTypes.string,
        country: PropTypes.string,
        birthDate: PropTypes.string,
        nationality: PropTypes.string,
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        shoeSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        hairColor: PropTypes.string,
        eyeColor: PropTypes.string,
        comments: PropTypes.string
    }),
    onSubmit: PropTypes.func.isRequired,
    submitButtonText: PropTypes.string,
    isLoading: PropTypes.bool,
    onCancel: PropTypes.func,
    hidePassword: PropTypes.bool
};

export default ModelForm;