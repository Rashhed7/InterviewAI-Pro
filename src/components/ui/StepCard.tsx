type StepCardProps = {
  number: string;
  title: string;
  description: string;
};

function StepCard({
  number,
  title,
  description,
}: StepCardProps) {
  return (
    <div
      className="
        bg-slate-900
        rounded-2xl
        p-8
        border
        border-slate-700
        hover:border-blue-500
        hover:shadow-2xl
hover:shadow-blue-500/20
        transition-all
        duration-300
        hover:-translate-y-2
      "
    >
      <div
        className="
          w-16
          h-16
          rounded-full
          bg-gradient-to-r from-blue-500 to-cyan-400
          text-white
          flex
          items-center
          justify-center
          text-2xl
          font-bold
        "
      >
        {number}
      </div>

      <h3 className="text-2xl text-white font-bold mt-6">
        {title}
      </h3>

      <p className="text-gray-400 mt-4">
        {description}
      </p>
    </div>
  );
}

export default StepCard;