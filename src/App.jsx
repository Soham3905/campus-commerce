import { useState } from "react";
import LoginPage from "./LoginPage";
import WelcomePage from "./WelcomePage";
import Dashboard from "./Dashboard";
/**
 * Simple state-driven navigation:
 * 1. Login Page  -> calls onLogin()         -> shows Welcome Page
 * 2. Welcome Page -> calls onGoToDashboard() -> shows Dashboard
 * 3. Dashboard   -> calls onLogout()        -> returns to Login Page
 */
export default function App() {
  // 'login' | 'welcome' | 'dashboard'
  const [page, setPage] = useState("dashboard");

  return (
    <div>
      {/* Step 1: Login */}
      {page === "login" && (
        <LoginPage onLogin={() => setPage("welcome")} />
      )}

      {/* Step 2: Welcome (3D Celebration) */}
      {page === "welcome" && (
        <WelcomePage onGoToDashboard={() => setPage("dashboard")} />
      )}

      {/* Step 3: Main SDUI Dashboard */}
      {page === "dashboard" && (
        <Dashboard onLogout={() => setPage("login")} />
      )}
    </div>
  );
}
