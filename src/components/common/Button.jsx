import styles from './Button.module.css';

export function Button({
  children,
  variant = 'primary',
  size = 'large',
  onClick,
  disabled = false,
  fullWidth = false,
  type = 'button',
}) {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
