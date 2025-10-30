import { useState } from "react";

export default function TextBox({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col gap-3 w-full">
      <textarea
        className="border rounded-lg p-3 h-40"
        placeholder="Paste news text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => onSubmit(text)}
        disabled={!text.trim()}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Classify Text
      </button>
    </div>
  );
}
