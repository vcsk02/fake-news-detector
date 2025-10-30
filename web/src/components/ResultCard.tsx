export default function ResultCard({ label, score }: { label: string; score: number }) {
  const pct = (score * 100).toFixed(1);
  return (
    <div className="bg-white shadow p-4 rounded-xl text-center">
      <h2 className="text-xl font-semibold mb-2">Result</h2>
      <p className="text-lg">
        Label:{" "}
        <span className={label === "fake" ? "text-red-600" : "text-green-600"}>
          {label.toUpperCase()}
        </span>
      </p>
      <p>Confidence: {pct}%</p>
    </div>
  );
}
