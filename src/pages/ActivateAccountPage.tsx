import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { BrandMark } from "../components/BrandMark";

export function ActivateAccountPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await api.activate(token, password);
      completeLogin(response.accessToken);
      navigate("/acesso");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Ativacao nao concluida.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="activation-title">
        <div className="auth-heading">
          <BrandMark />
          <h1 id="activation-title">Ativacao de Conta</h1>
        </div>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Token
            <input
              name="token"
              onChange={(event) => setToken(event.target.value)}
              required
              type="text"
              value={token}
            />
          </label>
          <label>
            Nova senha
            <input
              autoComplete="new-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary-button" disabled={isSubmitting} type="submit">
            <CheckCircle2 size={18} />
            <span>{isSubmitting ? "Ativando" : "Ativar"}</span>
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Login</Link>
          <Link to="/recuperar-senha">Recuperar senha</Link>
        </div>
      </section>
    </main>
  );
}
