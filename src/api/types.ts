export type UserStatus = "CONVIDADO" | "ATIVO" | "INATIVO";
export type GlobalRole = "NENHUM" | "ADMINISTRADOR_GLOBAL";
export type TeamRole = "GESTOR_DE_EQUIPE" | "MEMBRO";

export interface LoginResponse {
  accessToken: string;
}

export interface InvitationResponse {
  email: string;
  expiresAt: string;
}

export interface UserSummary {
  id: string;
  email: string;
  name?: string | null;
  status: UserStatus;
  globalRole: GlobalRole;
}

export interface TeamSummary {
  id: string;
  name: string;
  description?: string | null;
  memberships?: Array<{
    id: string;
    role: TeamRole;
    user: UserSummary;
  }>;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string | null;
  teams?: Array<{
    id: string;
    team: TeamSummary;
  }>;
}
