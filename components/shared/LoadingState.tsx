import React from "react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Загрузка...",
}) => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4 shadow-lg"></div>
        <p className="text-gray-400 animate-pulse text-lg font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
