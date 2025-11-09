import React from "react";

const Loading = ({ fullScreen = true, text = "Loading..." }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-full z-50 bg-white flex flex-col items-center justify-center ${
        fullScreen ? "min-h-screen" : "py-12"
      }`}
    >
      <div className="relative">
        {/* Outer circle */}
        <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>

        {/* Inner animated circle */}
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-blue-500 border-r-blue-500 rounded-full animate-spin">
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Loading text */}
      <p className="mt-4 text-blue-600 font-medium text-lg">{text}</p>

      {/* Optional: Animated dots */}
      <div className="flex space-x-1 mt-2">
        {[0, 1, 2].map((dot) => (
          <div
            key={dot}
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{
              animationDelay: `${dot * 0.15}s`,
              animationDuration: "1s",
              animationIterationCount: "infinite",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
