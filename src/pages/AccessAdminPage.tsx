import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { Link2, Plus, Send, UsersRound } from "lucide-react";
import { api } from "../api/client";
import { ProjectSummary, TeamRole, TeamSummary, UserSummary } from "../api/types";
import { useAuth } from "../auth/AuthContext";

export function AccessAdminPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    try {
      const [usersResponse, teamsResponse, projectsResponse] = await Promise.all([
        api.getUsers(token),
        api.getTeams(token),
        api.getProjects(token)
      ]);
      setUsers(usersResponse);
      setTeams(teamsResponse);
      setProjects(projectsResponse);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar dados.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [token]);

  function handleCreated(text: string) {
    setMessage(text);
    void loadData();
  }

  const counts = useMemo(
    () => [
      { label: "Usuarios", value: users.length },
      { label: "Equipes", value: teams.length },
      { label: "Projetos", value: projects.length }
    ],
    [projects.length, teams.length, users.length]
  );

  return (
    <section className="page-stack" aria-labelledby="access-title">
      <header className="page-header">
        <div>
          <p className="eyebrow">Gestao de Acesso MVP</p>
          <h1 id="access-title">Acesso</h1>
        </div>
        <div className="metric-strip" aria-label="Resumo">
          {counts.map((item) => (
            <span key={item.label}>
              <strong>{item.value}</strong>
              {item.label}
            </span>
          ))}
        </div>
      </header>

      {message ? <p className="form-success">{message}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      <div className="admin-grid">
        <InviteUserForm token={token} onCreated={handleCreated} />
        <CreateTeamForm token={token} onCreated={handleCreated} />
        <CreateProjectForm token={token} onCreated={handleCreated} />
        <TeamMembershipForm token={token} users={users} teams={teams} onCreated={handleCreated} />
        <ProjectTeamForm token={token} teams={teams} projects={projects} onCreated={handleCreated} />
      </div>

      <div className="data-grid">
        <DataPanel title="Usuarios" isLoading={isLoading}>
          {users.map((user) => (
            <article className="data-row" key={user.id}>
              <div>
                <strong>{user.name ?? user.email}</strong>
                <span>{user.email}</span>
              </div>
              <small>{user.globalRole}</small>
            </article>
          ))}
        </DataPanel>
        <DataPanel title="Equipes" isLoading={isLoading}>
          {teams.map((team) => (
            <article className="data-row" key={team.id}>
              <div>
                <strong>{team.name}</strong>
                <span>{team.description ?? "Sem descricao"}</span>
              </div>
              <small>{team.memberships?.length ?? 0} vinculos</small>
            </article>
          ))}
        </DataPanel>
        <DataPanel title="Projetos" isLoading={isLoading}>
          {projects.map((project) => (
            <article className="data-row" key={project.id}>
              <div>
                <strong>{project.name}</strong>
                <span>{project.description ?? "Sem descricao"}</span>
              </div>
              <small>{project.teams?.length ?? 0} equipes</small>
            </article>
          ))}
        </DataPanel>
      </div>
    </section>
  );
}

function InviteUserForm({
  token,
  onCreated
}: {
  token: string | null;
  onCreated: (message: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [globalRole, setGlobalRole] = useState<"NENHUM" | "ADMINISTRADOR_GLOBAL">("NENHUM");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    await api.inviteUser(token, { email, name, globalRole });
    setEmail("");
    setName("");
    setGlobalRole("NENHUM");
    onCreated("Convite de Usuario criado.");
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>Convite de Usuario</h2>
      <label>
        Nome
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Email
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        Papel global
        <select value={globalRole} onChange={(event) => setGlobalRole(event.target.value as "NENHUM" | "ADMINISTRADOR_GLOBAL")}>
          <option value="NENHUM">Nenhum</option>
          <option value="ADMINISTRADOR_GLOBAL">Administrador Global</option>
        </select>
      </label>
      <button className="secondary-button" type="submit">
        <Send size={17} />
        <span>Convidar</span>
      </button>
    </form>
  );
}

function CreateTeamForm({
  token,
  onCreated
}: {
  token: string | null;
  onCreated: (message: string) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    await api.createTeam(token, { name, description });
    setName("");
    setDescription("");
    onCreated("Equipe criada.");
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>Equipe</h2>
      <label>
        Nome
        <input required value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Descricao
        <input value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <button className="secondary-button" type="submit">
        <Plus size={17} />
        <span>Criar equipe</span>
      </button>
    </form>
  );
}

function CreateProjectForm({
  token,
  onCreated
}: {
  token: string | null;
  onCreated: (message: string) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    await api.createProject(token, { name, description });
    setName("");
    setDescription("");
    onCreated("Projeto criado.");
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>Projeto</h2>
      <label>
        Nome
        <input required value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Descricao
        <input value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <button className="secondary-button" type="submit">
        <Plus size={17} />
        <span>Criar projeto</span>
      </button>
    </form>
  );
}

function TeamMembershipForm({
  token,
  users,
  teams,
  onCreated
}: {
  token: string | null;
  users: UserSummary[];
  teams: TeamSummary[];
  onCreated: (message: string) => void;
}) {
  const [userId, setUserId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [role, setRole] = useState<TeamRole>("MEMBRO");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    await api.createTeamMembership(token, teamId, { userId, role });
    onCreated("Vinculo de Equipe salvo.");
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>Vinculo de Equipe</h2>
      <label>
        Usuario
        <select required value={userId} onChange={(event) => setUserId(event.target.value)}>
          <option value="">Selecione</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name ?? user.email}
            </option>
          ))}
        </select>
      </label>
      <label>
        Equipe
        <select required value={teamId} onChange={(event) => setTeamId(event.target.value)}>
          <option value="">Selecione</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Papel de Equipe
        <select value={role} onChange={(event) => setRole(event.target.value as TeamRole)}>
          <option value="MEMBRO">Membro</option>
          <option value="GESTOR_DE_EQUIPE">Gestor de Equipe</option>
        </select>
      </label>
      <button className="secondary-button" type="submit">
        <UsersRound size={17} />
        <span>Salvar vinculo</span>
      </button>
    </form>
  );
}

function ProjectTeamForm({
  token,
  teams,
  projects,
  onCreated
}: {
  token: string | null;
  teams: TeamSummary[];
  projects: ProjectSummary[];
  onCreated: (message: string) => void;
}) {
  const [projectId, setProjectId] = useState("");
  const [teamId, setTeamId] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    await api.linkProjectTeam(token, projectId, { teamId });
    onCreated("Vinculo de Projeto salvo.");
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>Vinculo de Projeto</h2>
      <label>
        Projeto
        <select required value={projectId} onChange={(event) => setProjectId(event.target.value)}>
          <option value="">Selecione</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Equipe
        <select required value={teamId} onChange={(event) => setTeamId(event.target.value)}>
          <option value="">Selecione</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>
      <button className="secondary-button" type="submit">
        <Link2 size={17} />
        <span>Salvar vinculo</span>
      </button>
    </form>
  );
}

function DataPanel({
  title,
  isLoading,
  children
}: {
  title: string;
  isLoading: boolean;
  children: ReactNode;
}) {
  return (
    <section className="data-panel">
      <h2>{title}</h2>
      {isLoading ? <p className="muted">Carregando</p> : <div className="data-list">{children}</div>}
    </section>
  );
}
