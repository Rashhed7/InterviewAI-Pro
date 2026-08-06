import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, Zap, Crown, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SUBSCRIPTION_PLANS, type PlanType } from "../constants/subscription";
import { subscriptionService, paymentService, type UserSubscriptionData } from "../services/subscriptionService";
import { authService } from "../services/authService";
import { SubscriptionBadge } from "../components/subscription/SubscriptionBadge";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [subscription, setSubscription] = useState<UserSubscriptionData>(subscriptionService.getSubscription());
  const [actionLoading, setActionLoading] = useState<PlanType | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    subscriptionService.fetchSubscriptionFromBackend().then((sub) => {
      setSubscription(sub);
    });
    loadRazorpayScript();
  }, []);

  const handleSelectPlan = async (targetPlan: PlanType) => {
    if (subscription.plan === targetPlan) return;

    if (targetPlan === "FREE") {
      setActionLoading("FREE");
      try {
        const res = await subscriptionService.updatePlan("FREE");
        if (res.success && res.subscription) {
          setSubscription(res.subscription);
          setToastMessage("Changed plan to Free.");
        }
      } catch (e: any) {
        alert(e.message || "Failed to switch plan.");
      } finally {
        setActionLoading(null);
      }
      return;
    }

    // ZERO-TRUST RAZORPAY PAYMENT FLOW FOR PRO & PREMIUM
    setActionLoading(targetPlan);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        setActionLoading(null);
        return;
      }

      // STEP 1: Backend creates Razorpay order & registers Payment with status: PENDING
      const orderData = await paymentService.createOrder(targetPlan);

      if (!orderData.success || !orderData.orderId) {
        throw new Error("Failed to initialize payment order.");
      }

      const currentUser = authService.getCurrentUser();

      // STEP 2: Open Razorpay Payment Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "InterviewAI Pro",
        description: `Upgrade to ${targetPlan} Plan`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          setActionLoading(targetPlan);
          try {
            // STEP 3: Backend verifies signature & updates DB (Status: SUCCESS, Plan: PRO, Subscription: ACTIVE)
            const verifyRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              setToastMessage(`🎉 ${verifyRes.message}`);
              await authService.fetchProfile();
              const freshSub = await subscriptionService.fetchSubscriptionFromBackend();
              setSubscription(freshSub);
              setTimeout(() => setToastMessage(null), 5000);
            }
          } catch (verifyError: any) {
            alert("Payment signature verification failed: " + (verifyError.message || "Invalid payment response"));
          } finally {
            setActionLoading(null);
          }
        },
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response: any) {
        alert(`Payment failed: ${response.error?.description || "Transaction cancelled"}`);
        setActionLoading(null);
      });

      razorpayInstance.open();
    } catch (err: any) {
      alert("Payment Error: " + (err.message || "Failed to initiate payment"));
    } finally {
      setActionLoading(null);
    }
  };

  const getPlanButtonText = (planId: PlanType) => {
    if (subscription.plan === planId) return "Current Plan";
    if (planId === "FREE") return "Get Started";
    if (planId === "PRO") return "Upgrade to Pro";
    if (planId === "PREMIUM") return "Go Premium";
    return "Select Plan";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 warm:bg-[#f5f0e6] warm:text-[#2c251e] flex font-sans transition-colors duration-300 eye-comfort-glow">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 my-2 space-y-8">
          {/* Header Banner */}
          <div className="text-center space-y-3 max-w-2xl mx-auto pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-indigo-400 warm:text-amber-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Simple, Transparent Pricing for Software Engineers
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] tracking-tight">
              Invest in Your Software Engineering Career
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 warm:text-[#736758] leading-relaxed">
              Unlock unlimited AI mock interviews, ATS resume analysis, and real-time coding feedback tailored for top tech companies.
            </p>

            {toastMessage && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 warm:text-emerald-900 text-xs font-bold rounded-2xl animate-in fade-in">
                {toastMessage}
              </div>
            )}
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-slate-900 dark:text-white warm:text-[#2c251e]" : "text-slate-500 dark:text-slate-400 warm:text-[#736758]"}`}>
              Monthly Billing
            </span>

            <button
              type="button"
              onClick={() => setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"))}
              className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-800 warm:bg-[#eae3d2] p-1 transition-colors duration-200 focus:outline-none"
              aria-label="Toggle Billing Cycle"
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-900 dark:bg-indigo-500 warm:bg-[#d97706] shadow-md transition-transform duration-200 ${
                  billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>

            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${billingCycle === "yearly" ? "text-slate-900 dark:text-white warm:text-[#2c251e]" : "text-slate-500 dark:text-slate-400 warm:text-[#736758]"}`}>
                Yearly Billing
              </span>
              <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 warm:text-amber-800 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Save 17% (2 Months Free)
              </span>
            </div>
          </div>

          {/* 3 Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* PLAN 1: FREE PLAN */}
            <div className={`glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${subscription.plan === "FREE" ? "border-slate-400 dark:border-slate-700 ring-2 ring-slate-400/20" : ""}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                      {SUBSCRIPTION_PLANS.FREE.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 warm:text-[#736758] mt-0.5">
                      Essential daily practice for beginners
                    </p>
                  </div>
                  {subscription.plan === "FREE" && <SubscriptionBadge plan="FREE" />}
                </div>

                <div className="border-y border-slate-200/80 dark:border-slate-800 warm:border-[#e2d9c8] py-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                      ₹0
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 warm:text-[#736758] font-semibold">
                      /month
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Free forever with daily usage limits</p>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 warm:text-[#2c251e]">
                  {SUBSCRIPTION_PLANS.FREE.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  disabled={subscription.plan === "FREE" || actionLoading !== null}
                  onClick={() => handleSelectPlan("FREE")}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    subscription.plan === "FREE"
                      ? "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 warm:bg-[#eae3d2] warm:text-[#736758] cursor-default"
                      : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 warm:bg-[#2c251e]"
                  }`}
                >
                  {getPlanButtonText("FREE")}
                </button>
              </div>
            </div>

            {/* PLAN 2: PRO PLAN (POPULAR) */}
            <div className={`glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative border-2 border-amber-500/40 dark:border-indigo-500/40 warm:border-amber-600/40 shadow-xl ${subscription.plan === "PRO" ? "ring-4 ring-amber-500/20 dark:ring-indigo-500/20" : ""}`}>
              {/* Popular Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
                <Zap className="w-3 h-3" /> Most Popular
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                      {SUBSCRIPTION_PLANS.PRO.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 warm:text-[#736758] mt-0.5">
                      Full access for active job hunters
                    </p>
                  </div>
                  {subscription.plan === "PRO" && <SubscriptionBadge plan="PRO" />}
                </div>

                <div className="border-y border-slate-200/80 dark:border-slate-800 warm:border-[#e2d9c8] py-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                      {billingCycle === "monthly" ? "₹399" : "₹332"}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 warm:text-[#736758] font-semibold">
                      /month
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-600 dark:text-indigo-400 warm:text-amber-700 font-semibold mt-1">
                    {billingCycle === "monthly" ? "Billed monthly" : "Billed annually as ₹3,990/year"}
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 warm:text-[#2c251e]">
                  {SUBSCRIPTION_PLANS.PRO.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 font-bold" />
                      <span className="font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  disabled={subscription.plan === "PRO" || actionLoading === "PRO"}
                  onClick={() => handleSelectPlan("PRO")}
                  className={`w-full py-3.5 rounded-2xl text-xs font-extrabold transition shadow-lg flex items-center justify-center gap-2 ${
                    subscription.plan === "PRO"
                      ? "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 warm:bg-[#eae3d2] warm:text-[#736758] cursor-default shadow-none"
                      : "bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white shadow-amber-500/20"
                  }`}
                >
                  {actionLoading === "PRO" ? "Updating..." : getPlanButtonText("PRO")}
                  {subscription.plan !== "PRO" && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* PLAN 3: PREMIUM PLAN */}
            <div className={`glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${subscription.plan === "PREMIUM" ? "border-amber-500 ring-4 ring-amber-500/20" : ""}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-amber-500" /> {SUBSCRIPTION_PLANS.PREMIUM.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 warm:text-[#736758] mt-0.5">
                      1-on-1 AI Coaching & System Design
                    </p>
                  </div>
                  {subscription.plan === "PREMIUM" && <SubscriptionBadge plan="PREMIUM" />}
                </div>

                <div className="border-y border-slate-200/80 dark:border-slate-800 warm:border-[#e2d9c8] py-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                      {billingCycle === "monthly" ? "₹799" : "₹665"}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 warm:text-[#736758] font-semibold">
                      /month
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 warm:text-amber-700 font-semibold mt-1">
                    {billingCycle === "monthly" ? "Billed monthly" : "Billed annually as ₹7,990/year"}
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 warm:text-[#2c251e]">
                  {SUBSCRIPTION_PLANS.PREMIUM.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-amber-500 shrink-0 font-bold" />
                      <span className={idx === 0 ? "font-bold text-amber-600 dark:text-amber-400 warm:text-amber-800" : ""}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  disabled={subscription.plan === "PREMIUM" || actionLoading === "PREMIUM"}
                  onClick={() => handleSelectPlan("PREMIUM")}
                  className={`w-full py-3.5 rounded-2xl text-xs font-extrabold transition shadow-lg flex items-center justify-center gap-2 ${
                    subscription.plan === "PREMIUM"
                      ? "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 warm:bg-[#eae3d2] warm:text-[#736758] cursor-default shadow-none"
                      : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 warm:bg-[#d97706] warm:hover:bg-[#b45309]"
                  }`}
                >
                  {actionLoading === "PREMIUM" ? "Updating..." : getPlanButtonText("PREMIUM")}
                  {subscription.plan !== "PREMIUM" && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Guarantee Footer Banner */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200/80 dark:border-slate-800 warm:border-[#e2d9c8]">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-indigo-500/20 dark:text-indigo-400 warm:bg-amber-600/20 warm:text-amber-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                  Risk-Free Practice Guarantee
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 warm:text-[#736758]">
                  Cancel or change your subscription plan anytime with 1-click in your account settings.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 warm:text-[#736758] shrink-0">
              <HelpCircle className="w-4 h-4" /> Need custom team plan? <Link to="/settings" className="text-amber-600 dark:text-indigo-400 font-bold hover:underline">Contact Support</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Pricing;
