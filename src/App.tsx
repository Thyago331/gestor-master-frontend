import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AccessAdminPage } from "./pages/AccessAdminPage";
import { ActivateAccountPage } from "./pages/ActivateAccountPage";
import { LoginPage } from "./pages/LoginPage";
import { MyAccessPage } from "./pages/MyAccessPage";
import { PasswordRecoveryPage } from "./pages/PasswordRecoveryPage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/ativacao" element={<ActivateAccountPage />} />
      <Route path="/recuperar-senha" element={<PasswordRecoveryPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/acesso" element={<AccessAdminPage />} />
        <Route path="/meu-acesso" element={<MyAccessPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/acesso" replace />} />
    </Routes>
  );
}
