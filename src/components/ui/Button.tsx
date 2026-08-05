type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const baseStyle =
    "px-6 py-3 rounded-xl font-semibold transition duration-300 hover:scale-105";

  const primary =
    "bg-blue-600 text-white hover:bg-blue-700";

  const secondary =
    "border border-gray-500 text-white hover:bg-gray-800";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${
        variant === "primary"
          ? primary
          : secondary
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;