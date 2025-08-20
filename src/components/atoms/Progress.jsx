import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Progress = forwardRef(({ 
  className,
  value = 0,
  max = 100,
  variant = "primary",
  size = "md",
  showValue = false,
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    primary: "bg-gradient-primary",
    secondary: "bg-gradient-secondary",
    accent: "bg-gradient-accent",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error"
  };

  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  return (
    <div className="w-full space-y-2">
      {showValue && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{Math.round(percentage)}%</span>
          <span>{value} / {max}</span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out rounded-full",
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;