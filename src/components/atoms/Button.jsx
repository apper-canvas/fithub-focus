import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  icon,
  iconPosition = "left",
  loading = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-primary text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-secondary text-white shadow-lg hover:shadow-xl",
    accent: "bg-gradient-accent text-white shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
    ghost: "text-primary bg-transparent hover:bg-primary/10",
    success: "bg-success text-white shadow-lg hover:bg-success/90",
    danger: "bg-error text-white shadow-lg hover:bg-error/90"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
    xl: "px-8 py-5 text-xl"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed btn-press focus:outline-none focus:ring-2 focus:ring-primary/20",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
      )}
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon name={icon} className="h-4 w-4" />
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon name={icon} className="h-4 w-4" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;