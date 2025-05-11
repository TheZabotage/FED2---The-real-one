import React from 'react';
import PropTypes from 'prop-types';

const ModelCard = ({ model, onEdit, onDelete }) => {
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString();
    };

    // Generate a simple avatar based on initials
    const getInitials = () => {
        if (!model.firstName || !model.lastName) return '??';
        return `${model.firstName.charAt(0)}${model.lastName.charAt(0)}`;
    };

    // Generate a background color based on name
    const getAvatarColor = () => {
        const colors = [
            '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
            '#1abc9c', '#d35400', '#34495e', '#16a085', '#27ae60'
        ];

        const hash = model.firstName.length + model.lastName.length;
        return colors[hash % colors.length];
    };

    return (
        <div className="model-card fade-in">
            <div className="model-card-header">
                <h3>{model.firstName} {model.lastName}</h3>
                <div className="model-actions">
                    <button
                        onClick={() => onEdit(model)}
                        className="btn btn-outline edit-btn"
                        title="Edit this model"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${model.firstName} ${model.lastName}?`)) {
                                onDelete(model.modelId);
                            }
                        }}
                        className="btn btn-outline delete-btn"
                        title="Delete this model"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="model-details">
                <div className="model-avatar-section">
                    <div
                        className="model-avatar"
                        style={{ backgroundColor: getAvatarColor() }}
                        title={`${model.firstName} ${model.lastName}`}
                    >
                        {getInitials()}
                    </div>
                    <div className="model-contact-info">
                        <p><strong>Email:</strong> {model.email}</p>
                        <p><strong>Phone:</strong> {model.phoneNo || 'Not provided'}</p>
                    </div>
                </div>

                {/* Show physical characteristics if available */}
                {(model.height || model.hairColor || model.eyeColor || model.shoeSize) && (
                    <div className="model-physical-info">
                        <h4>Physical Characteristics</h4>
                        <div className="physical-details">
                            {model.height && <span className="detail-badge">Height: {model.height}cm</span>}
                            {model.shoeSize && <span className="detail-badge">Shoe: {model.shoeSize}</span>}
                            {model.hairColor && <span className="detail-badge">Hair: {model.hairColor}</span>}
                            {model.eyeColor && <span className="detail-badge">Eyes: {model.eyeColor}</span>}
                        </div>
                    </div>
                )}

                {/* Show additional details if available */}
                <div className="additional-details">
                    {model.birthDate && (
                        <p>
                            <strong>Birth Date:</strong> {formatDate(model.birthDate)}
                        </p>
                    )}

                    {model.nationality && (
                        <p><strong>Nationality:</strong> {model.nationality}</p>
                    )}
                </div>

                {/* Show address if available */}
                {(model.addressLine1 || model.city || model.country) && (
                    <div className="address-details">
                        <h4>Address</h4>
                        <address>
                            {model.addressLine1 && <p>{model.addressLine1}</p>}
                            {model.addressLine2 && <p>{model.addressLine2}</p>}
                            <p>
                                {model.city && <span>{model.city}</span>}
                                {model.zip && <span> {model.zip}</span>}
                                {(model.city || model.zip) && model.country && <span>, </span>}
                                {model.country && <span>{model.country}</span>}
                            </p>
                        </address>
                    </div>
                )}

                {model.comments && (
                    <div className="comments-section">
                        <h4>Notes</h4>
                        <p className="comments-text">{model.comments}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

ModelCard.propTypes = {
    model: PropTypes.shape({
        modelId: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phoneNo: PropTypes.string,
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        shoeSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        hairColor: PropTypes.string,
        eyeColor: PropTypes.string,
        addressLine1: PropTypes.string,
        addressLine2: PropTypes.string,
        city: PropTypes.string,
        zip: PropTypes.string,
        country: PropTypes.string,
        birthDate: PropTypes.string,
        nationality: PropTypes.string,
        comments: PropTypes.string
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ModelCard;