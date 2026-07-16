// A small wrapper so every form field gets consistent labeling,
// error display, and accessible association (label -> input via htmlFor/id).
export default function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? (
        <span className="error-text" role="alert">{error}</span>
      ) : hint ? (
        <span className="hint">{hint}</span>
      ) : null}
    </div>
  );
}
