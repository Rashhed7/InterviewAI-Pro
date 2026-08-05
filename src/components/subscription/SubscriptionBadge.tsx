import { Zap, Crown, Sparkles } from "lucide-react";
import { type PlanType, SUBSCRIPTION_PLANS } from "../../constants/subscription";

interface SubscriptionBadgeProps {
  plan: PlanType;
  showIcon?: boolean;
  className?: string;
}

export function SubscriptionBadge({ plan, showIcon = true, className = "" }: SubscriptionBadgeProps) {
  const planInfo = SUBSCRIPTION_PLANS[plan] || SUBSCRIPTION_PLANS.FREE;

  const renderIcon = () => {
    if (!showIcon) return null;
    if (plan === "PREMIUM") return <Crown className="w-3 h-3 text-amber-500 shrink-0" />;
    if (plan === "PRO") return <Zap className="w-3 h-3 text-blue-500 dark:text-indigo-400 shrink-0" />;
    return <Sparkles className="w-3 h-3 text-slate-400 shrink-0" />;
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${planInfo.badgeColor} ${className}`}
    >
      {renderIcon()}
      {planInfo.name}
    </span>
  );
}
