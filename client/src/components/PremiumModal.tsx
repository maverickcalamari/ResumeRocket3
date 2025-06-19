import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Remove features, savings, and plan selection if you want a single price

export default function PremiumModal({ isOpen, onClose }) {
  // Flat price, no plan selection
  const price = 49.99;

  // Remove handleUpgrade (Stripe, etc.), we will embed PayPal below

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Purchase Access
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">${price}</div>
            <div className="mb-4 text-gray-600">One-time payment for full access</div>
            {/* PayPal Button Embed */}
            <div id="paypal-button-container" className="flex justify-center">
              <script
                src="https://www.paypal.com/sdk/js?client-id=BAAP2WHNZkL82bsMvM_5LuvOVvdVdoUELK20DBrEoUrViTiN41uiYT881kg43nhSN50wsayh-FpPmUDl7A&components=hosted-buttons&enable-funding=venmo&currency=USD"
              ></script>
              <div
                dangerouslySetInnerHTML={{
                  __html: `<div id="paypal-container"></div>
                  <script>
                    paypal.HostedButtons({
                      hostedButtonId: "YOUR_HOSTED_BUTTON_ID" // Replace with your PayPal hosted button ID
                    }).render('#paypal-container');
                  </script>
                  `
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}