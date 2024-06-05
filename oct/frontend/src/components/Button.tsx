import "src/assets/css/button.css";

type ButtonProps = {
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  onClick?: () => void;
};

export default function Button({
  children,
  color = "#438efd",
  textColor = "#ffffff",
  onClick,
}: ButtonProps) {
  return (
    <div
      style={{ backgroundColor: color, color: textColor }}
      className="button"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
