import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="
        sticky
        top-0
        z-50
        flex
        items-center
        justify-between
        px-10
        py-5
        bg-slate-900/80
        backdrop-blur-lg
        border-b
        border-slate-800
      "
    >
      <Link to="/" className="text-2xl font-bold text-white hover:opacity-90 transition-opacity">
        🤖 InterviewAI Pro
      </Link>

      <div className="flex gap-8 text-gray-300 items-center">
        <Link
          to="/"
          className="
            hover:text-blue-400
            transition-colors
            duration-300
          "
        >
          Home
        </Link>
        <a
          href="#features"
          className="
            hover:text-blue-400
            transition-colors
            duration-300
          "
        >
          Features
        </a>
        <a
          href="#about"
          className="
            hover:text-blue-400
            transition-colors
            duration-300
          "
        >
          About
        </a>
        <a
          href="#pricing"
          className="
            hover:text-blue-400
            transition-colors
            duration-300
          "
        >
          Pricing
        </a>
        <Link
          to="/login"
          className="
            hover:text-blue-400
            transition-colors
            duration-300
            font-medium
          "
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;