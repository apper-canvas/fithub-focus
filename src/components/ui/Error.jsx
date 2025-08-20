import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  description = "We couldn't load your data. Please try again.",
  onRetry,
  variant = "default"
}) => {
  if (variant === "card") {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="AlertTriangle" className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-red-900">{message}</h3>
            <p className="text-sm text-red-700">{description}</p>
          </div>
        </div>
        {onRetry && (
          <Button 
            variant="outline"
            size="sm"
            onClick={onRetry}
            icon="RefreshCw"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-display font-bold text-red-900 mb-2">{message}</h3>
      <p className="text-red-700 text-center mb-6 max-w-md">{description}</p>
      {onRetry && (
        <Button 
          variant="outline"
          onClick={onRetry}
          icon="RefreshCw"
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;