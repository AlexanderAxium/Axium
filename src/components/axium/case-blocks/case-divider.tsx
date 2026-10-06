"use client";

interface CaseDividerProps {
  variant?: "line" | "wave" | "gradient";
  background?: "light" | "dark" | "white";
}

export function CaseDivider({
  variant = "gradient",
  background = "light",
}: CaseDividerProps) {
  const bgClass =
    background === "dark"
      ? "bg-[#0a0f1f]"
      : background === "white"
        ? "bg-white"
        : "bg-[#f8fafb]";

  if (variant === "wave") {
    return (
      <div className={`relative ${bgClass}`}>
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
          role="presentation"
        >
          <path
            d="M0 24C240 4 480 44 720 24C960 4 1200 44 1440 24V48H0V24Z"
            className={
              background === "dark" ? "fill-[#0072CF]/10" : "fill-[#0072CF]/5"
            }
          />
        </svg>
      </div>
    );
  }

  if (variant === "line") {
    return (
      <div className={`${bgClass} py-2`}>
        <div className="container-section">
          <div className="content-section">
            <div
              className={`h-px ${
                background === "dark" ? "bg-white/10" : "bg-[#E5EAF3]"
              }`}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgClass} py-4`}>
      <div className="container-section">
        <div className="content-section">
          <div
            className="h-px"
            style={{
              background:
                background === "dark"
                  ? "linear-gradient(90deg, transparent, rgba(0,114,207,0.3), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(0,114,207,0.15), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
