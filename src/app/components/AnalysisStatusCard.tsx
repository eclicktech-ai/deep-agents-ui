"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContextMenu } from "@/providers/ContextProvider";

export function AnalysisStatusCard() {
  const { deepResearchStatus, onboardingStatus } = useContextMenu();
  const [cardMounted, setCardMounted] = useState(false);
  const [cardExiting, setCardExiting] = useState(false);

  // Mount animation for status card
  useEffect(() => {
    if (deepResearchStatus === "loading" || deepResearchStatus === "failed") {
      const timer = setTimeout(() => setCardMounted(true), 100);
      return () => clearTimeout(timer);
    }
  }, [deepResearchStatus]);

  // Exit animation when status becomes completed or failed - delay 5 seconds then slide out
  useEffect(() => {
    const isCompleted = deepResearchStatus === "completed" || onboardingStatus?.researchStatus === "completed";
    const isFailed = deepResearchStatus === "failed" || onboardingStatus?.researchStatus === "failed";
    if ((isCompleted || isFailed) && cardMounted && !cardExiting) {
      // Wait 5 seconds before starting exit animation
      const delayTimer = setTimeout(() => {
        // Start exit animation (slide left)
        setCardExiting(true);
        // Hide card after animation completes (500ms)
        setTimeout(() => {
          setCardMounted(false);
        }, 500);
      }, 5000); // 5 second delay
      
      return () => clearTimeout(delayTimer);
    }
  }, [deepResearchStatus, onboardingStatus?.researchStatus, cardMounted, cardExiting]);

  // Don't render if status is idle or card is not mounted
  const shouldShow = deepResearchStatus !== "idle" && cardMounted;
  if (!shouldShow) return null;

  // Determine status
  const isCompleted = deepResearchStatus === "completed" || onboardingStatus?.researchStatus === "completed";
  const isFailed = deepResearchStatus === "failed" || onboardingStatus?.researchStatus === "failed";
  const isLoading = deepResearchStatus === "loading" && !isCompleted && !isFailed;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-[100] w-full max-w-[360px] transition-all duration-700 ease-in-out",
        cardExiting
          ? "opacity-0 -translate-x-full scale-95"
          : "opacity-100 translate-x-0 scale-100"
      )}
    >
      <div
        className={cn(
          "rounded-xl border shadow-2xl p-5 backdrop-blur-md transition-all",
          isLoading
            ? "border-amber-200 bg-white/95 dark:border-amber-900/50 dark:bg-amber-950/95"
            : isFailed
            ? "border-red-200 bg-white/95 dark:border-red-900/50 dark:bg-red-950/95"
            : "border-emerald-200 bg-white/95 dark:border-emerald-900/50 dark:bg-emerald-950/95"
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm",
              isLoading
                ? "bg-amber-100 dark:bg-amber-900/50"
                : isFailed
                ? "bg-red-100 dark:bg-red-900/50"
                : "bg-emerald-100 dark:bg-emerald-900/50"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-amber-600 dark:text-amber-400" />
            ) : isFailed ? (
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            ) : (
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div>
              <p className="text-base font-bold text-foreground">
                {isLoading ? "Analyzing Brand" : isFailed ? "Analysis Failed" : "Analysis Complete"}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground font-medium">
                {isLoading
                  ? onboardingStatus?.currentStep
                    ? onboardingStatus.currentStep
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                    : "Deep Research in progress..."
                  : isFailed
                  ? "Please refresh the page and try again"
                  : "Context data is ready"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

