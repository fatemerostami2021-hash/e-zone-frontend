function FormField({ label, error, children }) {
  return (
    <div className="ez-form-field">
      <label>{label}</label>
      {children}
      {error && <span className="ez-form-field-error">{error}</span>}
    </div>
  );
}

export default FormField;
