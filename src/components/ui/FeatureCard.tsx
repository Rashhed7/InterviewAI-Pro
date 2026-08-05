type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
};

function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
  <div
    className="
      bg-slate-800/70
      backdrop-blur-md
      p-8
      rounded-2xl
      border
      border-slate-700
      hover:border-blue-500
      hover:shadow-2xl
      hover:shadow-blue-500/20
      hover:-translate-y-2
      transition-all
      duration-300
    "
  >
    <div className="text-5xl">{icon}</div>

    <h3 className="text-white text-2xl font-bold mt-6">
      {title}
    </h3>

    <p className="text-gray-400 mt-4 leading-7">
      {description}
    </p>
  </div>
);
}

export default FeatureCard;