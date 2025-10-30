export type ClassifyResponse = {
  label: "real" | "fake";
  score: number;
  threshold: number;
};
