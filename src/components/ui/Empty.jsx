import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  icon = "Search",
  actionLabel,
  onAction,
  variant = "default"
}) => {
  if (variant === "card") {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-display font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>
          {actionLabel && onAction && (
            <Button 
              variant="primary"
              onClick={onAction}
              icon="Plus"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-display font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button 
          variant="primary"
          size="lg"
          onClick={onAction}
          icon="Plus"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;