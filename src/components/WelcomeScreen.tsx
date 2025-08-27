import { LoadingSpinner } from "./LoadingSpinner";
import safeDineLogo from "@/assets/safedine-logo.jpg";

export const WelcomeScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-32 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
      
      {/* Main content */}
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="relative">
          <img 
            src={safeDineLogo} 
            alt="SafeDine Logo" 
            className="w-24 h-24 mx-auto rounded-2xl shadow-medium object-cover"
          />
          <div className="absolute -inset-2 bg-gradient-primary rounded-3xl opacity-20 blur-xl animate-pulse-slow" />
        </div>

        {/* Welcome text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              SafeDine
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Your allergen-friendly dining companion
          </p>
        </div>

        {/* Loading spinner */}
        <div className="pt-8">
          <LoadingSpinner size="lg" className="mx-auto" />
          <p className="text-sm text-muted-foreground mt-4 animate-pulse-slow">
            Setting up your safe dining experience...
          </p>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary" />
    </div>
  );
};