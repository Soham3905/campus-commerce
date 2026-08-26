import React, { useState } from "react";
import { LoginScreen } from "./components/auth/LoginScreen";
import { WelcomeTransition } from "./components/auth/WelcomeTransition";
import { OnboardingWizard } from "./components/onboarding/OnboardingWizard";
import { ThankYouTransition } from "./components/onboarding/ThankYouTransition";
import { CmsLayout } from "./cms/components/layout/CmsLayout";
import { StorageService } from "./cms/services/storage";
import { FoundationRepository } from "./cms/services/foundationRepository";

const AUTH_STORAGE_KEY = "campus_sdui_auth_state";

export function App() {
  const [phase, setPhase] = useState(() => {
    const saved = StorageService.get(AUTH_STORAGE_KEY, null);
    return saved?.completedOnboarding ? "cms" : "login";
  });

  const [user, setUser] = useState(null);
  const [foundation, setFoundation] = useState(() => FoundationRepository.get());

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPhase("welcome");
  };

  const handleWelcomeProceed = () => {
    setPhase("onboarding");
  };

  const handleWelcomeBack = () => {
    setPhase("login");
  };

  const handleOnboardingBack = () => {
    setPhase("welcome");
  };

  const handleOnboardingComplete = (foundationData) => {
    setFoundation(foundationData);
    FoundationRepository.save(foundationData);
    setPhase("thankyou");
  };

  const handleThankYouBack = () => {
    setPhase("onboarding");
  };

  const handleEnterDashboard = () => {
    StorageService.set(AUTH_STORAGE_KEY, { completedOnboarding: true, user });
    setPhase("cms");
  };

  const handleLogout = () => {
    StorageService.remove(AUTH_STORAGE_KEY);
    setPhase("login");
    setUser(null);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {phase === "login" && <LoginScreen onLoginSuccess={handleLoginSuccess} />}
      {phase === "welcome" && (
        <WelcomeTransition
          user={user}
          onProceed={handleWelcomeProceed}
          onBack={handleWelcomeBack}
        />
      )}
      {phase === "onboarding" && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onBack={handleOnboardingBack}
        />
      )}
      {phase === "thankyou" && (
        <ThankYouTransition
          user={user}
          foundation={foundation}
          onEnterDashboard={handleEnterDashboard}
          onBack={handleThankYouBack}
        />
      )}
      {phase === "cms" && <CmsLayout onLogout={handleLogout} user={user} />}
    </div>
  );
}

export default App;
