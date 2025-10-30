import { useState } from "react";
import { classifyText } from "../api/client";
import TextBox from "../components/TextBox";
import ResultCard from "../components/ResultCard";

export default function ClassifyPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleClassify(text: string) {
    setLoading(true);
    try {
      const res = await classifyText(text);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 flex flex-col gap-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Fake News Detector</h1>
      <TextBox onSubmit={handleClassify} />
      {loading && <p>Classifying...</p>}
      {result && <ResultCard label={result.label} score={result.score} />}
    </div>
  );
}
