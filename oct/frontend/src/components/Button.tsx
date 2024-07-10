import "src/assets/css/button.css";

type ButtonProps = {
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  onClick?: () => void;
  unavailable?: boolean;
  width?: string;
  height?: string;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  color = "#438efd",
  textColor = "#ffffff",
  unavailable = false,
  onClick,
  width = "inherit",
  height = "inherit",
  type = "button",
}: ButtonProps) {
  return (
    <button
      style={{
        backgroundColor: color,
        color: textColor,
        width: width,
        height: height,
      }}
      className={"button " + (unavailable ? "unavailable" : "")}
      onClick={unavailable ? undefined : onClick}
      type={type}
    >
      {children}
    </button>
  );
}
