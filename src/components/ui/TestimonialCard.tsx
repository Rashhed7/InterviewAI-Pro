type TestimonialCardProps = {
  name: string;
  role: string;
  review: string;
};

function TestimonialCard({
  name,
  role,
  review,
}: TestimonialCardProps) {
  return (
    <div
      className="
        bg-slate-900
        rounded-2xl
        border
        border-slate-700
        p-8
        hover:border-blue-500
        hover:shadow-2xl
hover:shadow-blue-500/20
        transition-all
        duration-300
        hover:-translate-y-2
      "
    >
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
  {name.charAt(0)}
</div>
      <div className="text-yellow-400 text-xl">
        ⭐⭐⭐⭐⭐
      </div>

      <p className="text-gray-300 mt-6 italic">
        "{review}"
      </p>

      <div className="mt-8">
        <h3 className="text-white font-bold">
          {name}
        </h3>

        <p className="text-gray-500 text-sm">
          {role}
        </p>
      </div>
    </div>
  );
}

export default TestimonialCard;