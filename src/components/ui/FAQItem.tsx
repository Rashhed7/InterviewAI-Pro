import { useState } from "react";

type FAQItemProps = {
  question: string;
  answer: string;
};

function FAQItem({
  question,
  answer,
}: FAQItemProps) {

  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        border
        border-slate-700
        rounded-xl
        mb-5
        bg-slate-900
      "
    >
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full
          flex
          justify-between
          items-center
          p-6
          text-left
          text-white
          font-semibold
        "
      >
        {question}

        <span className="text-2xl">
          {open ? "▼" : "▶"}
        </span>
      </button>

      {open && (
        <div className="px-6 pb-6 text-gray-400">
          {answer}
        </div>
      )}
    </div>
  );
}

export default FAQItem;