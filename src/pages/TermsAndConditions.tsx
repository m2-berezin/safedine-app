import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Scale, Users, Shield, AlertCircle, Phone, Mail } from "lucide-react";

export default function TermsAndConditions() {
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
            <h1 className="text-xl font-bold text-foreground">Terms & Conditions</h1>
            <p className="text-sm text-muted-foreground">Terms of use for SafeDine</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Overview */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>Last updated:</strong> January 2024
            </p>
            <p>
              Welcome to SafeDine! These Terms and Conditions ("Terms") govern your use of the SafeDine platform and services. 
              By using SafeDine, you agree to be bound by these Terms.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium mb-2">Important Notice</h4>
              <p className="text-sm">
                SafeDine is a digital ordering platform that facilitates communication between diners and restaurants. 
                We are not a restaurant and do not prepare or serve food. Each restaurant is responsible for their own food safety, 
                allergen information, and order fulfillment.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Acceptance of Terms */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              By accessing or using SafeDine, you acknowledge that you have read, understood, and agree to be bound by these Terms. 
              If you do not agree to these Terms, you may not use our service.
            </p>
            
            <div>
              <h4 className="font-medium mb-2">Age Requirements</h4>
              <p className="text-sm text-muted-foreground">
                • You must be at least 13 years old to use SafeDine<br/>
                • Users under 18 must have parental consent<br/>
                • You are responsible for ensuring compliance with local age restrictions
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Account Responsibility</h4>
              <p className="text-sm text-muted-foreground">
                • You are responsible for maintaining account security<br/>
                • You must provide accurate information<br/>
                • You may not share your account with others<br/>
                • Notify us immediately of any unauthorized access
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Our Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">What SafeDine Provides</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Digital menu browsing with allergen and dietary filtering</li>
                <li>• Order placement and communication with restaurants</li>
                <li>• Personal preference management (dietary restrictions, allergens)</li>
                <li>• Order history and favorite item tracking</li>
                <li>• Customer support for platform-related issues</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">What SafeDine Does NOT Provide</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Food preparation or delivery services</li>
                <li>• Payment processing (handled by individual restaurants)</li>
                <li>• Guarantee of allergen information accuracy</li>
                <li>• Restaurant reservations or table management</li>
                <li>• Resolution of food quality or service issues</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 dark:bg-amber-950/20 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Important Disclaimer</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    SafeDine provides allergen information as supplied by restaurants. Always verify with restaurant staff 
                    if you have severe allergies or dietary restrictions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Your Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Proper Use</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Use SafeDine only for legitimate dining purposes</li>
                <li>• Provide accurate dietary and allergen information</li>
                <li>• Respect restaurant staff and other users</li>
                <li>• Follow all applicable laws and regulations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Prohibited Activities</h4>
              <p className="text-sm text-muted-foreground mb-2">You may not:</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Place fake or fraudulent orders</li>
                <li>• Attempt to hack or disrupt our systems</li>
                <li>• Share false allergen or dietary information</li>
                <li>• Use offensive language or harassment</li>
                <li>• Violate any restaurant's policies or local laws</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Safety Responsibilities</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Always inform restaurant staff of severe allergies</li>
                <li>• Double-check allergen information with the restaurant</li>
                <li>• Report any food safety concerns immediately</li>
                <li>• Use SafeDine's allergen filters as a guide, not a guarantee</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Liability and Disclaimers */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Liability & Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Limitation of Liability</h4>
              <p className="text-sm text-muted-foreground mb-2">
                SafeDine serves as an intermediary platform. We are not liable for:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Food quality, safety, or preparation</li>
                <li>• Allergic reactions or dietary issues</li>
                <li>• Restaurant service or behavior</li>
                <li>• Payment disputes with restaurants</li>
                <li>• Inaccurate allergen information provided by restaurants</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Service Availability</h4>
              <p className="text-sm text-muted-foreground">
                SafeDine strives for 99.9% uptime, but we cannot guarantee uninterrupted service. 
                We are not liable for service interruptions, maintenance periods, or technical issues.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Third-Party Content</h4>
              <p className="text-sm text-muted-foreground">
                Menu items, prices, and allergen information are provided by restaurants. 
                SafeDine does not verify this information and is not responsible for its accuracy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Your Right to Terminate</h4>
              <p className="text-sm text-muted-foreground">
                You may delete your account at any time through the app settings. 
                Account deletion will permanently remove your personal data, preferences, and order history.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Our Right to Terminate</h4>
              <p className="text-sm text-muted-foreground mb-2">
                We may suspend or terminate accounts for violations of these Terms, including:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Fraudulent activity or false information</li>
                <li>• Harassment of restaurant staff or other users</li>
                <li>• Attempts to compromise system security</li>
                <li>• Repeated violations of restaurant policies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              We may update these Terms from time to time to reflect changes in our service or legal requirements. 
              When we make material changes, we will:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Notify you via email or in-app notification</li>
              <li>• Update the "Last updated" date at the top of this page</li>
              <li>• Provide a summary of major changes</li>
              <li>• Give you time to review before the changes take effect</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Continued use of SafeDine after changes become effective constitutes acceptance of the updated Terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Questions About These Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              If you have questions about these Terms & Conditions, please contact us:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">legal@safedine.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+44 800 123 456</span>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm">
                <strong>SafeDine Ltd.</strong><br/>
                123 Digital Way<br/>
                London, UK SW1A 1AA<br/>
                Company Registration: 12345678
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
                Contact Legal Team
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/privacy-policy")}
                className="flex-1"
              >
                Privacy Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}