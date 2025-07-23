"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  hostedButtonId: string;
  price?: number;
}

export default function PremiumModal({
  isOpen,
  onClose,
  hostedButtonId,
  price = 49.99,
}: PremiumModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    const renderPayPal = () => {
      if (window.paypal && containerRef.current) {
        containerRef.current.innerHTML = "";
        setLoading(false);

        try {
          window.paypal.HostedButtons({
            hostedButtonId,
          }).render(containerRef.current);
        } catch (err) {
          console.error("PayPal render failed:", err);
        }
      }
    };

    const alreadyLoaded = typeof window !== "undefined" && window.paypal;
    const needsScript = !alreadyLoaded && !scriptRef.current;

    if (needsScript) {
      setLoading(true);
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?components=hosted-buttons";
      script.async = true;
      script.onload = renderPayPal;
      document.body.appendChild(script);
      scriptRef.current = script;
    } else {
      renderPayPal();
    }

    return () => {
      // Optional cleanup
    };
  }, [isOpen, hostedButtonId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-describedby="premium-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Unlock Premium Access
            </span>
          </DialogTitle>
        </DialogHeader>

        <div id="premium-modal-description" className="sr-only">
          One-time payment for full resume platform access.
        </div>

        <div className="space-y-6 text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            ${price.toFixed(2)}
          </div>
          <div className="mb-4 text-gray-600">
            One-time secure PayPal checkout for lifetime access.
          </div>
          <div className="flex justify-center">
            <div
              ref={containerRef}
              style={{
                minWidth: "300px",
                maxWidth: "400px",
                width: "100%",
                minHeight: "80px",
                overflow: "hidden",
              }}
            />
          </div>

          {loading && (
            <p className="text-sm text-gray-400 mt-2">Loading PayPal...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
