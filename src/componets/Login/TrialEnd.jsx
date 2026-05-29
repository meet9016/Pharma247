import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { FaClock, FaCalendarAlt } from "react-icons/fa";

const SubscriptionModal = ({ subscriptionType = "trial" }) => {
  const [showPopup, setShowPopup] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const isTrial = subscriptionType === "trial";

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
    }, 400);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Background Overlay */}
      {showPopup && (
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
        />
      )}

      {/* Modal */}
      {showPopup && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-500 ${
            isClosing ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
        >
          <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close"
            >
              <MdClose className="w-6 h-6" />
            </button>

            {/* Top Accent Bar */}
            <div
              className="h-2"
              style={{ background: isTrial ? "#f31c1c" : "#f6a609" }}
            />

            {/* Content */}
            <div className="p-6 sm:p-8 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: isTrial
                      ? "rgba(243, 28, 28, 0.1)"
                      : "rgba(246, 166, 9, 0.1)",
                  }}
                >
                  {isTrial ? (
                    <FaClock
                      className="w-10 h-10"
                      style={{ color: "#f31c1c" }}
                    />
                  ) : (
                    <FaCalendarAlt
                      className="w-10 h-10"
                      style={{ color: "#f6a609" }}
                    />
                  )}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-800">
                {isTrial ? "Trial Period Ending Soon" : "Subscription Expired"}
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                {isTrial
                  ? "Your 7-day trial is ending soon. Continue enjoying premium features by upgrading to a paid plan."
                  : "Your 1-year subscription has expired. Renew now to regain full access to all premium benefits."}
              </p>

              {/* Features */}
              <div className="rounded-xl bg-gray-50 p-5 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  {isTrial ? "With a subscription, you’ll get:" : "Renew to enjoy:"}
                </h3>
                <ul className="space-y-2">
                  {[
                    "Unlimited access to all features",
                    "Priority customer support",
                    "Regular updates and improvements",
                    "Ad-free experience",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start text-sm sm:text-base">
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-[#3f6212]"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="inline-block">
                  <span
                    className="text-4xl sm:text-5xl font-bold"
                    style={{ color: "#3f6212" }}
                  >
                    $99
                  </span>
                  <span className="text-gray-500 ml-2 text-lg">/year</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  That’s just $8.25 per month
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 py-3 px-6 rounded-lg text-white font-semibold text-base transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: "#3f6212" }}
                >
                  {isTrial ? "Purchase Plan" : "Renew Subscription"}
                </button>

                <button
                  onClick={handleClose}
                  className="sm:w-auto py-3 px-6 rounded-lg border-2 font-semibold text-base transition-all duration-200 hover:bg-gray-50"
                  style={{
                    borderColor: "#3f6212",
                    color: "#3f6212",
                  }}
                >
                  Maybe Later
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-4">
                Cancel anytime. No questions asked.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionModal;
