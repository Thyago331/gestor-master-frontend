import { useEffect, useState } from "react";
import { api } from "../api/client";
import { ProjectSummary, TeamSummary, UserSummary } from "../api/types";
import { useAuth } from "../auth/AuthContext";

export function MyAccessPage() {
  const { token } = useAuth();
  const [me, setMe] = useState<UserSummary | null>(null);
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const accessToken = token;

    async function load() {
      try {
        const [meResponse, teamsResponse, projectsResponse] = await Promise.all([
          api.getMe(accessToken),
          api.getTeams(accessToken),
          api.getProjects(accessToken)
        ]);
        setMe(meResponse);
        setTeams(teamsResponse);
        setProjects(projectsResponse);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar acesso.");
      }
    }

    void load();
  }, [token]);

  return (
    <section className="page-stack" aria-labelledby="my-access-title">
      <header className="page-header">
        <div>
          <p className="eyebrow">Usuario autenticado</p>
          <h1 id="my-access-title">Meu acesso</h1>
        </div>
      </header>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="profile-band">
        <div>
          <span>Email</span>
          <strong>{me?.email ?? "-"}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{me?.status ?? "-"}</strong>
        </div>
        <div>
          <span>Papel global</span>
          <strong>{me?.globalRole ?? "-"}</strong>
        </div>
      </div>

      <div className="data-grid">
        <section className="data-panel">
          <h2>Vinculos de Equipe</h2>
          <div className="data-list">
            {teams.map((team) => (
              <article className="data-row" key={team.id}>
                <div>
                  <strong>{team.name}</strong>
                  <span>{team.description ?? "Sem descricao"}</span>
                </div>
                <small>{team.memberships?.length ?? 0} usuarios</small>
              </article>
            ))}
          </div>
        </section>
        <section className="data-panel">
          <h2>Projetos visiveis</h2>
          <div className="data-list">
            {projects.map((project) => (
              <article className="data-row" key={project.id}>
                <div>
                  <strong>{project.name}</strong>
                  <span>{project.description ?? "Sem descricao"}</span>
                </div>
                <small>{project.teams?.length ?? 0} equipes</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
