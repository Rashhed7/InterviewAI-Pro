import { useState } from "react";
import { FileText, Save } from "lucide-react";

export function CodeNotebook() {
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem("candidate_notebook") || "# Interview Notes\n\n- Space Complexity O(1) two-pointer pattern\n- Sliding window optimal condition";
  });

  const handleSave = () => {
    localStorage.setItem("candidate_notebook", notes);
  };

  return (
    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <span className="font-bold text-white flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-purple-400" /> Personal Markdown Notebook
        </span>
        <button
          onClick={handleSave}
          className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] transition flex items-center gap-1"
        >
          <Save className="w-3 h-3" /> Save Notes
        </button>
      </div>

      <textarea
        rows={8}
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          localStorage.setItem("candidate_notebook", e.target.value);
        }}
        placeholder="Type Markdown notes, algorithm templates, or memory bounds here..."
        className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-purple-200 font-mono text-xs outline-none focus:border-purple-500 leading-relaxed"
      />
    </div>
  );
}
