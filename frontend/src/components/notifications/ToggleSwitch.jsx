import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ checked, onChange, disabled, loading }) => {
  return (
    <label className={`toggle-switch ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled || loading}
      />
      <span className="toggle-slider">
        {loading && (
          <span className="toggle-loading-spinner"></span>
        )}
      </span>
    </label>
  );
};

export default ToggleSwitch;