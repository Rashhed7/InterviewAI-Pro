type InputProps = {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
      w-full
      p-3
      rounded-xl
      bg-slate-800
      border
      border-slate-700
      text-white
      outline-none
      focus:border-blue-500
      transition
      "
    />
  );
}

export default Input;