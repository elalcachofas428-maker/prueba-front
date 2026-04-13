export default function Badge({ children, variant = 'accent', icon }) {
  return (
    <span className={`badge badge-${variant}`}>
      {icon && icon}
      {children}
    </span>
  );
}
