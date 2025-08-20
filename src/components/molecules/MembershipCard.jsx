import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const MembershipCard = ({ member }) => {
  const [showQR, setShowQR] = useState(false);

  const isExpiringSoon = () => {
    const expiryDate = new Date(member.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const getDaysRemaining = () => {
    const expiryDate = new Date(member.expiryDate);
    const today = new Date();
    return Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="bg-gradient-secondary text-white border-0 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-display font-bold mb-1">{member.name}</h3>
            <Badge 
              variant={member.status === "Active" ? "success" : "warning"} 
              className="bg-white/20 text-white border-white/30"
            >
              {member.status}
            </Badge>
          </div>
          <ApperIcon name="CreditCard" className="h-8 w-8 text-white/70" />
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Plan</span>
            <span className="font-semibold">{member.membershipPlan}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/80">Expires</span>
            <span className={`font-semibold ${isExpiringSoon() ? "text-warning" : ""}`}>
              {new Date(member.expiryDate).toLocaleDateString()}
            </span>
          </div>
          {isExpiringSoon() && (
            <div className="flex items-center gap-2 text-warning bg-warning/20 px-3 py-2 rounded-lg">
              <ApperIcon name="AlertTriangle" className="h-4 w-4" />
              <span className="text-sm">Expires in {getDaysRemaining()} days</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button
            variant="accent"
            className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
            icon={showQR ? "X" : "QrCode"}
            onClick={() => setShowQR(!showQR)}
          >
            {showQR ? "Hide QR Code" : "Show QR Code"}
          </Button>

          <motion.div
            initial={false}
            animate={{ height: showQR ? "auto" : 0, opacity: showQR ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white/20 rounded-lg p-4 flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mb-3">
                <div className="w-20 h-20 bg-gray-900 rounded flex items-center justify-center">
                  <ApperIcon name="QrCode" className="h-12 w-12 text-white" />
                </div>
              </div>
              <p className="text-sm text-white/80 text-center">
                Scan this code at the gym entrance
              </p>
              <p className="text-xs text-white/60 mt-1">ID: {member.qrCode}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </Card>
  );
};

export default MembershipCard;