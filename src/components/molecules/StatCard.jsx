import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue,
  variant = "default",
  className = ""
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-primary text-white border-0";
      case "accent":
        return "bg-gradient-accent text-white border-0";
      case "success":
        return "bg-gradient-to-br from-success to-green-600 text-white border-0";
      default:
        return "bg-gradient-card";
    }
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-error";
    return "text-gray-500";
  };

  const getTrendIcon = () => {
    if (trend === "up") return "TrendingUp";
    if (trend === "down") return "TrendingDown";
    return "Minus";
  };

  return (
    <Card className={`${getVariantStyles()} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${variant === "default" ? "text-gray-600" : "text-white/80"} mb-1`}>
            {title}
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className={`text-2xl font-display font-bold ${variant === "default" ? "text-gray-900" : "text-white"}`}>
              {value}
            </h3>
            {trendValue && (
              <span className={`text-sm font-medium flex items-center gap-1 ${
                variant === "default" ? getTrendColor() : "text-white/80"
              }`}>
                <ApperIcon name={getTrendIcon()} className="h-3 w-3" />
                {trendValue}
              </span>
            )}
          </div>
          {subtitle && (
            <p className={`text-xs ${variant === "default" ? "text-gray-500" : "text-white/60"}`}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-lg ${
            variant === "default" 
              ? "bg-primary/10 text-primary" 
              : "bg-white/20 text-white"
          }`}>
            <ApperIcon name={icon} className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;