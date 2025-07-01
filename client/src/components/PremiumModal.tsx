"use client";

import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const price = 49.99;
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    const renderPayPal = () => {
      if (window.paypal && containerRef.current) {
        try {
          containerRef.current.innerHTML = ""; // Clear existing buttons
          window.paypal.HostedButtons({
            hostedButtonId: "NCAWHR9E5S5U2",
          }).render(containerRef.current);
        } catch (err) {
          console.error("PayPal render failed:", err);
        }
      }
    };

    if (!window.paypal) {
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=BAAP2WHNZkL82bsMvM_5LuvOVvdVdoUELK20DBrEoUrViTiN41uiYT881kg43nhSN50wsayh-FpPmUDl7A&components=hosted-buttons&enable-funding=venmo&currency=USD";
      script.async = true;
      script.onload = renderPayPal;
      document.body.appendChild(script);
      scriptRef.current = script;
    } else {
      renderPayPal();
    }

    return () => {
      // Clean up PayPal script (optional, prevents clutter)
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-describedby="premium-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Purchase Access
            </span>
          </DialogTitle>
        </DialogHeader>

        <div id="premium-modal-description" className="sr-only">
          One-time payment for premium resume access via PayPal Hosted Buttons.
        </div>

        <div className="space-y-6 text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">${price}</div>
          <div className="mb-4 text-gray-600">
            One-time payment for full access
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
