import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, Database, Mail, Phone } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-soft border-b sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/main", { state: { activeTab: "profile" } })}
            className="shrink-0 hover:bg-primary/10 transition-colors"
            aria-label="Go back to profile"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Your privacy is important to us</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Overview */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy at SafeDine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>Last updated:</strong> January 2024
            </p>
            <p>
              At SafeDine, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, store, and protect your data when you use our digital dining platform.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-2">Quick Summary</h4>
              <ul className="text-sm space-y-1">
                <li>• We only collect information necessary to provide our service</li>
                <li>• Your dietary preferences and allergen data are encrypted and secure</li>
                <li>• We never sell your personal information to third parties</li>
                <li>• You can delete your account and data at any time</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Personal Information</h4>
              <p className="text-sm text-muted-foreground mb-2">
                When you create an account or use SafeDine, we may collect:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Email address and contact information</li>
                <li>• Dietary preferences and allergen information</li>
                <li>• Order history and favorite items</li>
                <li>• Restaurant visit history</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Usage Information</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Device type and browser information</li>
                <li>• IP address and location data (when permitted)</li>
                <li>• Usage patterns and preferences</li>
                <li>• Error logs and performance data</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Guest Users</h4>
              <p className="text-sm text-muted-foreground">
                If you use SafeDine without creating an account, we only store temporary data in your browser 
                to maintain your session and preferences during your visit.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">Service Provision</h4>
              <p className="text-sm text-muted-foreground">
                • Filter menu items based on your dietary restrictions and allergens<br/>
                • Process orders and communicate with restaurant staff<br/>
                • Save your preferences and order history for convenience
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Safety & Security</h4>
              <p className="text-sm text-muted-foreground">
                • Ensure accurate allergen information is displayed<br/>
                • Prevent fraud and unauthorized access<br/>
                • Comply with food safety regulations
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Communication</h4>
              <p className="text-sm text-muted-foreground">
                • Respond to your support requests and feedback<br/>
                • Send important service updates (only with your consent)<br/>
                • Notify you about order status changes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              How We Protect Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">Encryption & Security</h4>
              <p className="text-sm text-muted-foreground">
                • All data is encrypted in transit and at rest<br/>
                • Secure servers with regular security updates<br/>
                • Limited access to personal data on a need-to-know basis
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Data Retention</h4>
              <p className="text-sm text-muted-foreground">
                • Account data is kept as long as your account is active<br/>
                • Order history is retained for 2 years for safety tracking<br/>
                • Guest session data is automatically deleted after 24 hours
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Access Controls</h4>
              <p className="text-sm text-muted-foreground">
                • Only authorized personnel can access personal data<br/>
                • All access is logged and monitored<br/>
                • Regular security audits and vulnerability assessments
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">You have the right to:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Access & Control</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• View all data we have about you</li>
                  <li>• Update or correct your information</li>
                  <li>• Delete your account and data</li>
                  <li>• Export your data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Communication Preferences</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Opt out of non-essential communications</li>
                  <li>• Control notification settings</li>
                  <li>• Withdraw consent at any time</li>
                  <li>• Request information about data sharing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third Parties */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              SafeDine works with trusted partners to provide our service:
            </p>
            <div>
              <h4 className="font-medium mb-1">Restaurant Partners</h4>
              <p className="text-sm text-muted-foreground mb-2">
                We share necessary order information (dietary restrictions, allergens) with restaurants to ensure safe food preparation.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Service Providers</h4>
              <p className="text-sm text-muted-foreground mb-2">
                We use secure cloud services for hosting and data storage. All providers meet strict security and privacy standards.
              </p>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm font-medium text-destructive">
                We never sell your personal information to advertisers or marketing companies.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Updates */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Contact Us About Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              If you have questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">privacy@safedine.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+44 800 123 456</span>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3">
              <h4 className="font-medium mb-1">Policy Updates</h4>
              <p className="text-sm text-muted-foreground">
                We may update this Privacy Policy from time to time. When we do, we'll notify you via email or through the app. 
                Continued use of SafeDine after changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate("/contact")}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Privacy Team
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/faqs")}
                className="flex-1"
              >
                Privacy FAQs
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}