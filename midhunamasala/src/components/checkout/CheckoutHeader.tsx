"use client";
import React from "react";
import { motion } from "framer-motion";
import {
    Lock,
    MapPin,
    ClipboardList,
    CreditCard,
    Check,
} from "lucide-react";

const STEPS = [
    { label: "Address", icon: MapPin },
    { label: "Review", icon: ClipboardList },
    { label: "Payment", icon: CreditCard },
];

interface CheckoutHeaderProps {
    currentStep: number;
    onStepClick?: (stepIndex: number) => void;
}

export default function CheckoutHeader({
    currentStep,
    onStepClick,
}: CheckoutHeaderProps) {
    return (
        <div className="bg-[#F0EAE0]">
            <div className="max-w-2xl mx-auto px-6 sm:px-8 pt-8 pb-6">
                {/* ── Top Row ── */}
                <div className="flex items-center justify-between mb-8">
                    <h1
                        className="text-2xl sm:text-3xl font-bold text-[#8B1E1E]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Checkout
                    </h1>
                    <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="text-xs sm:text-[13px] font-normal tracking-wide text-[#D4AF37] italic"
                            style={{ fontFamily: "'Crimson Text', serif" }}>
                            Secure checkout
                        </span>
                    </div>
                </div>

                {/* ── Stepper ── */}
                <div className="flex items-center justify-center">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        const isActive = i === currentStep;
                        const isCompleted = i < currentStep;
                        const isClickable = isCompleted && onStepClick;

                        return (
                            <React.Fragment key={step.label}>
                                <button
                                    id={`checkout-step-${step.label.toLowerCase()}`}
                                    onClick={() => isClickable && onStepClick(i)}
                                    disabled={!isClickable}
                                    className={`flex items-center gap-2.5 transition-all duration-300 ${isClickable ? "cursor-pointer group" : "cursor-default"
                                        }`}
                                >
                                    {/* Circle */}
                                    <div
                                        className={`relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive
                                            ? "border-[1.5px] border-[#8B1E1E]"
                                            : isCompleted
                                                ? "border-[1.5px] border-[#8B1E1E] bg-[#8B1E1E] group-hover:bg-[#6B1515]"
                                                : "border border-gray-200"
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                        ) : (
                                            <Icon
                                                className={`w-3.5 h-3.5 transition-colors duration-300 ${isActive ? "text-[#8B1E1E]" : "text-gray-300"
                                                    }`}
                                                strokeWidth={1.5}
                                            />
                                        )}

                                        {/* Subtle active pulse */}
                                        {isActive && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full border border-[#8B1E1E]/20"
                                                initial={{ scale: 1, opacity: 0.4 }}
                                                animate={{ scale: 1.4, opacity: 0 }}
                                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                                            />
                                        )}
                                    </div>

                                    {/* Label */}
                                    <span
                                        className={`text-[13px] whitespace-nowrap transition-colors duration-300 hidden sm:inline ${isActive
                                            ? "text-[#8B1E1E] font-bold"
                                            : isCompleted
                                                ? "text-gray-500 font-medium group-hover:text-gray-700"
                                                : "text-gray-300 font-normal"
                                            }`}
                                        style={isActive ? { fontFamily: "'Playfair Display', serif" } : undefined}
                                    >
                                        {step.label}
                                    </span>
                                </button>

                                {/* Connecting line */}
                                {i < STEPS.length - 1 && (
                                    <div className="flex-1 mx-5 sm:mx-8 h-[1px] bg-gray-200 relative max-w-[100px]">
                                        <motion.div
                                            initial={false}
                                            animate={{ width: isCompleted ? "100%" : "0%" }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="absolute inset-y-0 left-0 bg-[#8B1E1E]"
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Bottom fade line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200/60 to-transparent" />
        </div>
    );
}
