"use client";

interface FlowBackgroundProps {
  enabled?: boolean;
  intensity?: "light" | "normal" | "strong";
  className?: string;
}

export default function FlowBackground({ 
  enabled = true, 
  intensity = "normal",
  className = ""
}: FlowBackgroundProps) {
  // ライン設定（mockup完全準拠）
  const getFlowLines = () => {
    const baseLines = [
      "flow-line-1", "flow-line-2", "flow-line-3", "flow-line-4",
      "flow-line-5", "flow-line-6", "flow-line-7", "flow-line-8"
    ];

    // 強度に応じてライン数を調整
    switch (intensity) {
      case "light":
        return baseLines.slice(0, 4);
      case "strong":
        return baseLines;
      default:
        return baseLines.slice(0, 6);
    }
  };

  // enabledがfalseの場合は何も表示しない
  if (!enabled) return null;

  const flowLines = getFlowLines();

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {flowLines.map((lineClass, index) => (
        <div
          key={index}
          className={`flow-line ${lineClass}`}
        />
      ))}
    </div>
  );
}