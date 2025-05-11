import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({
    type = 'text',
    id,
    name,
    label,
    value,
    onChange,
    placeholder = '',
    required = false,
    disabled = false,
    rows = 3,
    min,
    max,
    step,
    className = '',
    error = ''
}) => {
    const fieldClass = `form-field ${className} ${error ? 'has-error' : ''}`;

    // Render different input types
    const renderInput = () => {
        switch (type) {
            case 'textarea':
                return (
                    <textarea
                        id={id}
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        rows={rows}
                        className="form-textarea"
                    />
                );

            case 'select':
                // This would require children to be passed in
                // For now, we'll show an error that this isn't implemented
                return (
                    <div className="error-message">
                        FormField does not support select type. Use a dedicated Select component.
                    </div>
                );

            default:
                // Default is any input type (text, email, password, number, date, etc.)
                return (
                    <input
                        type={type}
                        id={id}
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        min={min}
                        max={max}
                        step={step}
                        className="form-input"
                    />
                );
        }
    };

    return (
        <div className={fieldClass}>
            <label htmlFor={id} className={required ? 'required-indicator' : ''}>
                {label}
            </label>
            {renderInput()}
            {error && <div className="field-error">{error}</div>}
        </div>
    );
};

FormField.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    rows: PropTypes.number,
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    error: PropTypes.string
};

export default FormField;