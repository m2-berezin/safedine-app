import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Shield, Info, ArrowLeft } from "lucide-react";

export default function Consent() {
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Check if consent already accepted
  useEffect(() => {
    const consentAccepted = localStorage.getItem('safedine.consentAccepted');
    if (consentAccepted === 'true') {
      // Auto-skip to allergen selection page
      navigate('/allergen-selection'); // Note: This page needs to be created
    }
  }, [navigate]);

  const handleAgreeAndContinue = () => {
    if (isChecked) {
      localStorage.setItem('safedine.consentAccepted', 'true');
      navigate('/allergen-selection'); // Note: This page needs to be created
    }
  };

  const consentText = `By continuing, I understand that SafeDine filters menu options based on the dietary and allergy preferences I select.

• If I continue as a Guest, my choices are saved only on this device and remain anonymous.

• If I create an account or log in, my preferences are linked to my profile so they can be remembered across visits and devices.

In all cases, no information is shared with third parties, and if I cannot find suitable options I will speak directly with staff.`;

  const extendedInfo = `SafeDine Privacy & Data Handling

Data Storage:
• Guest users: All preferences stored locally on your device only
• Registered users: Preferences encrypted and stored securely in our database
• No personal data is ever shared with restaurants or third parties

Allergen Information:
• SafeDine uses restaurant-provided ingredient data to filter menu items
• We cannot guarantee 100% accuracy due to kitchen cross-contamination
• Always inform restaurant staff of severe allergies
• SafeDine is a filtering tool, not a medical device

Data Retention:
• Guest data: Remains on device until manually cleared
• Account data: Retained until account deletion
• No tracking or analytics beyond essential app functionality

Your Rights:
• View, modify, or delete your preferences at any time
• Export your data if you have an account
• Contact support for any data-related questions`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">Before we continue</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Icon and Subtitle */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">
            Please review how SafeDine uses your information.
          </p>
        </div>

        {/* Consent Text Card */}
        <Card className="mb-6 border-border shadow-soft">
          <CardContent className="p-0">
            <ScrollArea className="h-64 p-6">
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {consentText}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Checkbox Agreement */}
        <div className="mb-8">
          <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border border-border">
            <Checkbox
              id="consent-checkbox"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked === true)}
              className="mt-1"
            />
            <label
              htmlFor="consent-checkbox"
              className="text-sm text-foreground font-medium leading-relaxed cursor-pointer select-none"
            >
              I have read and agree to how SafeDine handles my dietary and allergy information.
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleAgreeAndContinue}
            disabled={!isChecked}
            className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium"
            size="lg"
          >
            Agree & Continue
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowModal(true)}
            className="w-full text-primary hover:bg-primary/10"
          >
            <Info className="h-4 w-4 mr-2" />
            Learn more about our privacy practices
          </Button>
        </div>
      </main>

      {/* Extended Information Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md mx-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy & Data Details
            </DialogTitle>
            <DialogDescription>
              Complete information about how SafeDine protects your data
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-line p-1">
              {extendedInfo}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}