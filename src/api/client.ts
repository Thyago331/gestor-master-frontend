import {
  InvitationResponse,
  LoginResponse,
  ProjectSummary,
  TeamRole,
  TeamSummary,
  UserSummary
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "Falha na requisicao.");
  }

  return response.json() as Promise<T>;
}

export const api = {
  login(email: string, password: string) {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },
  activate(token: string, password: string) {
    return request<LoginResponse>("/auth/activate", {
      method: "POST",
      body: JSON.stringify({ token, password })
    });
  },
  requestPasswordReset(email: string) {
    return request<{ message: string }>("/auth/password-recovery/request", {
      method: "POST",
      body: JSON.stringify({ email })
    });
  },
  completePasswordReset(token: string, password: string) {
    return request<{ message: string }>("/auth/password-recovery/complete", {
      method: "POST",
      body: JSON.stringify({ token, password })
    });
  },
  inviteUser(
    token: string,
    payload: { email: string; name?: string; globalRole?: "NENHUM" | "ADMINISTRADOR_GLOBAL" }
  ) {
    return request<InvitationResponse>(
      "/auth/invitations",
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      token
    );
  },
  getMe(token: string) {
    return request<UserSummary>("/users/me", {}, token);
  },
  getUsers(token: string) {
    return request<UserSummary[]>("/users", {}, token);
  },
  getTeams(token: string) {
    return request<TeamSummary[]>("/teams", {}, token);
  },
  createTeam(token: string, payload: { name: string; description?: string }) {
    return request<TeamSummary>(
      "/teams",
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      token
    );
  },
  createTeamMembership(
    token: string,
    teamId: string,
    payload: { userId: string; role: TeamRole }
  ) {
    return request<TeamSummary>(
      `/teams/${teamId}/memberships`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      token
    );
  },
  getProjects(token: string) {
    return request<ProjectSummary[]>("/projects", {}, token);
  },
  createProject(token: string, payload: { name: string; description?: string }) {
    return request<ProjectSummary>(
      "/projects",
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      token
    );
  },
  linkProjectTeam(token: string, projectId: string, payload: { teamId: string }) {
    return request<ProjectSummary>(
      `/projects/${projectId}/teams`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      token
    );
  }
};
