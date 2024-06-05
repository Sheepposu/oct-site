import "src/assets/css/button.css";

type ButtonProps = {
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  color = "#438efd",
  textColor = "#ffffff",
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      style={{ backgroundColor: color, color: textColor }}
      className="button"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
