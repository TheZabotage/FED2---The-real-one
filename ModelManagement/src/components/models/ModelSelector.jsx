// src/components/models/ModelSelector.jsx
import PropTypes from 'prop-types';

const ModelSelector = ({
    models,
    selectedModelId,
    onChange,
    disabled = false,
    label = 'Select Model:',
    placeholder = '-- Select a Model --',
    required = false,
    name = 'modelSelect'
}) => {
    return (
        <div className="model-selector form-group">
            <label htmlFor={name}>{label}</label>
            <select
                id={name}
                name={name}
                value={selectedModelId}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={required}
                className="form-select"
            >
                <option value="">{placeholder}</option>
                {models.map((model) => (
                    <option key={model.modelId} value={model.modelId}>
                        {model.firstName} {model.lastName}
                    </option>
                ))}
            </select>
        </div>
    );
};

ModelSelector.propTypes = {
    models: PropTypes.arrayOf(
        PropTypes.shape({
            modelId: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired
        })
    ).isRequired,
    selectedModelId: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    name: PropTypes.string
};

export default ModelSelector;