import { LogOut, Shield, UserRound } from "lucide-react";
import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { BrandMark } from "./BrandMark";

export function AppShell({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <BrandMark size="compact" />
          <span>Gestor Master</span>
        </div>
        <nav className="nav-list" aria-label="Navegacao principal">
          <NavLink to="/acesso">
            <Shield size={18} />
            <span>Acesso</span>
          </NavLink>
          <NavLink to="/meu-acesso">
            <UserRound size={18} />
            <span>Meu acesso</span>
          </NavLink>
        </nav>
        <button className="icon-text-button sidebar-action" type="button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </aside>
      <main className="main-panel">{children}</main>
    </div>
  );
}
