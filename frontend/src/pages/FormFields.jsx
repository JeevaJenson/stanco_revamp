import React from "react";

/* =========================================================
   INPUT FIELD WITH ICON
========================================================= */
export const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  icon: Icon,
  readOnly = false,
}) => {
  return (
    <div className="rfh-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <div className="rfh-input-wrapper">
        {Icon && <Icon className="rfh-input-icon" />}
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          readOnly={readOnly}
          style={{ paddingLeft: Icon ? "38px" : "14px" }}
        />
      </div>
    </div>
  );
};

/* =========================================================
   SELECT FIELD WITH ICON
========================================================= */
export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  icon: Icon,
}) => {
  return (
    <div className="rfh-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <div className="rfh-input-wrapper">
        {Icon && <Icon className="rfh-input-icon" />}
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          style={{ paddingLeft: Icon ? "38px" : "14px" }}
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

/* =========================================================
   TEXTAREA FIELD
========================================================= */
export const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  helperText = "",
  maxLength,
}) => {
  return (
    <div className="rfh-field rfh-full-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      <div className="rfh-textarea-footer">
        {helperText && <span className="rfh-helper-text">{helperText}</span>}
        {maxLength && (
          <span className="rfh-char-counter">
            {(value || "").length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
