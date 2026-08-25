import React, { useState } from "react";
import { LoginScreen } from "./components/auth/LoginScreen";
import { WelcomeTransition } from "./components/auth/WelcomeTransition";
import { OnboardingWizard } from "./components/onboarding/OnboardingWizard";
import { ThankYouTransition } from "./components/onboarding/ThankYouTransition";
import { CmsLayout } from "./cms/components/layout/CmsLayout";
import { StorageService } from "./cms/services/storage";

const AUTH_STORAGE_KEY = "campus_sdui_auth_state";

export function App() {
  const [phase, setPhase] = useState(() => {
    const saved = StorageService.get(AUTH_STORAGE_KEY, null);
    return saved?.completedOnboarding ? "cms" : "login";
  });

  const [user, setUser] = useState(null);
  const [foundation, setFoundation] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPhase("welcome");
  };

  const handleWelcomeProceed = () => {
    setPhase("onboarding");
  };

  const handleOnboardingComplete = (foundationData) => {
    setFoundation(foundationData);
    setPhase("thankyou");
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
      {phase === "welcome" && <WelcomeTransition onProceed={handleWelcomeProceed} />}
      {phase === "onboarding" && <OnboardingWizard onComplete={handleOnboardingComplete} />}
      {phase === "thankyou" && <ThankYouTransition onEnterDashboard={handleEnterDashboard} />}
      {phase === "cms" && <CmsLayout onLogout={handleLogout} />}
    </div>
  );
}

export default App;
