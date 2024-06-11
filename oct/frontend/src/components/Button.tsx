import "src/assets/css/button.css";

type ButtonProps = {
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  onClick?: () => void;
  unavailable?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  color = "#438efd",
  textColor = "#ffffff",
  unavailable = false,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      style={{ backgroundColor: color, color: textColor }}
      className={"button " + (unavailable ? "unavailable" : "")}
      onClick={unavailable ? undefined : onClick}
      type={type}
    >
      {children}
    </button>
  );
}
