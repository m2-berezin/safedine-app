import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Search, HelpCircle, Phone, MessageCircle, Shield, Utensils, CreditCard, Clock } from "lucide-react";

export default function FAQs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: "General Questions",
      icon: HelpCircle,
      faqs: [
        {
          question: "What is SafeDine?",
          answer: "SafeDine is a digital dining platform that helps you order food safely while considering your dietary restrictions and allergens. You can browse menus, place orders, and get personalized recommendations based on your dietary needs."
        },
        {
          question: "How do I get started?",
          answer: "Simply scan the QR code at your table or select your location and table manually. Set up your dietary preferences and allergen information, then start browsing the menu. You can dine as a guest or create an account for a personalized experience."
        },
        {
          question: "Is SafeDine free to use?",
          answer: "Yes! SafeDine is completely free for diners. There are no hidden fees or charges for using our platform to browse menus and place orders."
        },
        {
          question: "Do I need to create an account?",
          answer: "No, you can use SafeDine as a guest. However, creating an account allows you to save your dietary preferences, track order history, save favorite items, and get a more personalized experience."
        }
      ]
    },
    {
      title: "Ordering & Payment",
      icon: CreditCard,
      faqs: [
        {
          question: "How do I place an order?",
          answer: "Browse the menu, add items to your cart, review your order, and tap 'Place Order'. Your order will be sent directly to the kitchen with your table number."
        },
        {
          question: "Can I modify my order after placing it?",
          answer: "Orders can only be modified within the first 2 minutes after placing them. After that, please speak to restaurant staff for any changes."
        },
        {
          question: "What payment methods are accepted?",
          answer: "Payment is handled directly by the restaurant. Most restaurants accept cash, card payments, and contactless payments. Check with your server for specific payment options available."
        },
        {
          question: "Can I split the bill?",
          answer: "Bill splitting depends on the restaurant's policy. Please ask your server about splitting the bill when you're ready to pay."
        }
      ]
    },
    {
      title: "Allergies & Dietary Requirements",
      icon: Shield,
      faqs: [
        {
          question: "How does allergen filtering work?",
          answer: "Set up your allergen preferences in your profile. SafeDine will automatically filter out items containing your allergens and highlight safe options for you. Always inform restaurant staff about severe allergies."
        },
        {
          question: "Is the allergen information accurate?",
          answer: "We work with restaurants to provide accurate allergen information, but ingredients can change. Always double-check with restaurant staff if you have severe allergies or dietary restrictions."
        },
        {
          question: "Can I see vegetarian/vegan options?",
          answer: "Yes! Set your dietary preferences (vegetarian, vegan, etc.) in your profile, and SafeDine will highlight suitable options and filter the menu accordingly."
        },
        {
          question: "What if I have multiple dietary restrictions?",
          answer: "SafeDine can handle multiple dietary restrictions and allergens. Set up all your requirements in your profile, and we'll show you items that meet all your criteria."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: Phone,
      faqs: [
        {
          question: "The app isn't working properly. What should I do?",
          answer: "Try refreshing the page first. If issues persist, contact restaurant staff or use the 'Request Staff Assistance' button in the Contact & Support section."
        },
        {
          question: "I can't see the menu. What's wrong?",
          answer: "Make sure you've selected the correct restaurant and table. If the menu still doesn't load, try refreshing the page or contact the restaurant staff."
        },
        {
          question: "My order didn't go through. What happened?",
          answer: "Check your internet connection and try again. If the problem persists, speak to restaurant staff immediately - they can help place your order manually."
        },
        {
          question: "Can I use SafeDine on any device?",
          answer: "Yes! SafeDine works on smartphones, tablets, and computers. It's optimized for mobile devices but works great on any device with a web browser."
        }
      ]
    },
    {
      title: "Restaurant Information",
      icon: Utensils,
      faqs: [
        {
          question: "How do I contact the restaurant?",
          answer: "Use the 'Call Restaurant' button in the Contact & Support section, or use the 'Request Staff Assistance' feature to get help at your table."
        },
        {
          question: "What are the restaurant's opening hours?",
          answer: "Restaurant hours are typically displayed in the Contact & Support section. Most restaurants are open from 10:00 AM to 10:00 PM, but hours may vary. Contact the restaurant directly for specific hours."
        },
        {
          question: "Does the restaurant offer takeaway/delivery?",
          answer: "SafeDine is primarily designed for dine-in experiences. For takeaway or delivery options, please contact the restaurant directly."
        },
        {
          question: "Can I make a reservation through SafeDine?",
          answer: "SafeDine focuses on table ordering rather than reservations. For table bookings, please contact the restaurant directly using the phone number in the Contact & Support section."
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

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
            <h1 className="text-xl font-bold text-foreground">Frequently Asked Questions</h1>
            <p className="text-sm text-muted-foreground">Find answers to common questions</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Search Bar */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <HelpCircle className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold">{faqCategories.reduce((acc, cat) => acc + cat.faqs.length, 0)}</p>
              <p className="text-xs text-muted-foreground">Total FAQs</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold">24/7</p>
              <p className="text-xs text-muted-foreground">Support</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold">&lt; 1min</p>
              <p className="text-xs text-muted-foreground">Avg. Response</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <Utensils className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold">Safe</p>
              <p className="text-xs text-muted-foreground">Dining</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-6">
            {filteredFAQs.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No FAQs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or browse all categories above.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Still Need Help */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Still Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Can't find what you're looking for? We're here to help!
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-auto py-3 flex-col gap-1"
                onClick={() => navigate("/contact")}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">Contact Form</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-3 flex-col gap-1"
                onClick={() => window.open('tel:+441202123456')}
              >
                <Phone className="h-4 w-4" />
                <span className="text-xs">Call Restaurant</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-3 flex-col gap-1"
                onClick={() => window.open('mailto:help@safedine.com')}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="text-xs">Email Support</span>
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Support Hours: 24/7 • Response Time: Within 1 hour</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}