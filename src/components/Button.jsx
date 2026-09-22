import './Button.css';

function Button({ children, variant = 'primary', ...props }) {
  return (
    <button className={`ez-button ez-button--${variant}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
