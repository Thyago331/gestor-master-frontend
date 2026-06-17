import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { api } from "../api/client";
import { BrandMark } from "../components/BrandMark";

export function PasswordRecoveryPage() {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get("token") ?? "";
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCompleting = token.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (isCompleting) {
        const response = await api.completePasswordReset(token, password);
        setMessage(response.message);
      } else {
        const response = await api.requestPasswordReset(email);
        setMessage(response.message);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Solicitacao nao concluida.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="recovery-title">
        <div className="auth-heading">
          <BrandMark />
          <h1 id="recovery-title">Recuperar senha</h1>
        </div>
        <form className="form-stack" onSubmit={handleSubmit}>
          {isCompleting ? (
            <>
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
            </>
          ) : (
            <label>
              Email
              <input
                autoComplete="email"
                inputMode="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
          )}
          {message ? <p className="form-success">{message}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary-button" disabled={isSubmitting} type="submit">
            <RotateCcw size={18} />
            <span>{isSubmitting ? "Enviando" : "Confirmar"}</span>
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Login</Link>
          <Link to="/ativacao">Ativacao de Conta</Link>
        </div>
      </section>
    </main>
  );
}
