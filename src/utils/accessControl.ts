import { appCache } from './cache';

export type UserRole = 'admin' | 'educador';

export interface AuthorizedUser {
  email: string;
  role: UserRole;
  nome?: string;
  adicionadoEm: string;
  adicionadoPor?: string;
  ativo: boolean;
  observacoes?: string;
}

export interface AccessControlConfig {
  restrictedMode: boolean; // if true, only whitelisted accounts can access
  superAdminEmail: string;
}

const ACCESS_CONTROL_STORAGE_KEY = 'bncc_access_control_users_v1';
const ACCESS_CONFIG_STORAGE_KEY = 'bncc_access_control_config_v1';

// Default initial administrators (includes the primary developer/user account)
const DEFAULT_SUPER_ADMIN = 'danielcardosobarba@gmail.com';

const INITIAL_AUTHORIZED_USERS: AuthorizedUser[] = [
  {
    email: DEFAULT_SUPER_ADMIN,
    role: 'admin',
    nome: 'Daniel Cardoso (Administrador Geral)',
    adicionadoEm: '2026-09-16T12:00:00.000Z',
    adicionadoPor: 'Sistema',
    ativo: true,
    observacoes: 'Administrador Inicial do Sistema'
  }
];

const DEFAULT_CONFIG: AccessControlConfig = {
  restrictedMode: true,
  superAdminEmail: DEFAULT_SUPER_ADMIN
};

/**
 * Get access control config
 */
export function getAccessControlConfig(): AccessControlConfig {
  try {
    const data = localStorage.getItem(ACCESS_CONFIG_STORAGE_KEY);
    if (!data) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch (e) {
    return DEFAULT_CONFIG;
  }
}

/**
 * Save access control config
 */
export function saveAccessControlConfig(config: Partial<AccessControlConfig>): AccessControlConfig {
  const current = getAccessControlConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(ACCESS_CONFIG_STORAGE_KEY, JSON.stringify(updated));
    appCache.remove('access_control_list');
  } catch (e) {
    console.error('Erro ao salvar config de acesso:', e);
  }
  return updated;
}

/**
 * Retrieve list of authorized users from storage or default seeds
 */
export function getAuthorizedUsers(): AuthorizedUser[] {
  // Check cache first for maximum performance
  const cached = appCache.get<AuthorizedUser[]>('access_control_list');
  if (cached) return cached;

  try {
    const data = localStorage.getItem(ACCESS_CONTROL_STORAGE_KEY);
    let list: AuthorizedUser[];
    if (!data) {
      list = [...INITIAL_AUTHORIZED_USERS];
      localStorage.setItem(ACCESS_CONTROL_STORAGE_KEY, JSON.stringify(list));
    } else {
      list = JSON.parse(data);
      // Ensure super admin is always present and active
      const hasSuperAdmin = list.some(u => u.email.toLowerCase() === DEFAULT_SUPER_ADMIN.toLowerCase());
      if (!hasSuperAdmin) {
        list.unshift(INITIAL_AUTHORIZED_USERS[0]);
        localStorage.setItem(ACCESS_CONTROL_STORAGE_KEY, JSON.stringify(list));
      }
    }

    appCache.set('access_control_list', list, 5 * 60 * 1000); // cache for 5 min
    return list;
  } catch (e) {
    console.error('Erro ao carregar lista de usuários autorizados:', e);
    return INITIAL_AUTHORIZED_USERS;
  }
}

/**
 * Persist authorized users list
 */
function persistAuthorizedUsers(users: AuthorizedUser[]): void {
  try {
    localStorage.setItem(ACCESS_CONTROL_STORAGE_KEY, JSON.stringify(users));
    appCache.set('access_control_list', users, 5 * 60 * 1000);
  } catch (e) {
    console.error('Erro ao salvar lista de usuários autorizados:', e);
  }
}

/**
 * Add a new authorized Google account
 */
export function addAuthorizedUser(
  email: string,
  role: UserRole = 'educador',
  nome?: string,
  adicionadoPor?: string,
  observacoes?: string
): { success: boolean; message: string; user?: AuthorizedUser } {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { success: false, message: 'Por favor, insira um e-mail Google válido.' };
  }

  const users = getAuthorizedUsers();
  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (existing) {
    if (!existing.ativo) {
      existing.ativo = true;
      existing.role = role;
      if (nome) existing.nome = nome;
      persistAuthorizedUsers(users);
      return { success: true, message: `Permissão reativada para ${normalizedEmail}.`, user: existing };
    }
    return { success: false, message: `A conta ${normalizedEmail} já está cadastrada.` };
  }

  const newUser: AuthorizedUser = {
    email: normalizedEmail,
    role,
    nome: nome?.trim() || normalizedEmail.split('@')[0],
    adicionadoEm: new Date().toISOString(),
    adicionadoPor: adicionadoPor || 'Administrador',
    ativo: true,
    observacoes: observacoes?.trim()
  };

  const updated = [newUser, ...users];
  persistAuthorizedUsers(updated);
  return { success: true, message: `Conta ${normalizedEmail} autorizada com sucesso como ${role === 'admin' ? 'Administrador' : 'Educador'}!`, user: newUser };
}

/**
 * Update user role or status
 */
export function updateAuthorizedUser(
  email: string,
  updates: Partial<Pick<AuthorizedUser, 'role' | 'nome' | 'ativo' | 'observacoes'>>
): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getAuthorizedUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);

  if (index === -1) return false;

  // Protect super admin from being deactivated or downgraded
  if (normalizedEmail === DEFAULT_SUPER_ADMIN.toLowerCase()) {
    updates.ativo = true;
    updates.role = 'admin';
  }

  users[index] = { ...users[index], ...updates };
  persistAuthorizedUsers(users);
  return true;
}

/**
 * Remove an authorized account
 */
export function removeAuthorizedUser(email: string): { success: boolean; message: string } {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === DEFAULT_SUPER_ADMIN.toLowerCase()) {
    return { success: false, message: 'O Administrador principal não pode ser removido.' };
  }

  const users = getAuthorizedUsers();
  const filtered = users.filter(u => u.email.toLowerCase() !== normalizedEmail);
  if (filtered.length === users.length) {
    return { success: false, message: 'Conta não encontrada na lista.' };
  }

  persistAuthorizedUsers(filtered);
  return { success: true, message: `Acesso da conta ${normalizedEmail} revogado com sucesso.` };
}

/**
 * Check if a Google email is authorized
 */
export function isUserAuthorized(email?: string | null): {
  authorized: boolean;
  role?: UserRole;
  user?: AuthorizedUser;
  reason?: string;
} {
  if (!email) {
    return { authorized: false, reason: 'E-mail não fornecido' };
  }

  const config = getAccessControlConfig();
  const normalized = email.trim().toLowerCase();

  // Super admin always authorized
  if (normalized === DEFAULT_SUPER_ADMIN.toLowerCase()) {
    return {
      authorized: true,
      role: 'admin',
      user: {
        email: normalized,
        role: 'admin',
        nome: 'Administrador Geral',
        adicionadoEm: new Date().toISOString(),
        ativo: true
      }
    };
  }

  // If restricted mode is disabled, all authenticated users are authorized as educadores
  if (!config.restrictedMode) {
    return { authorized: true, role: 'educador' };
  }

  const users = getAuthorizedUsers();
  const found = users.find(u => u.email.toLowerCase() === normalized && u.ativo);

  if (found) {
    return {
      authorized: true,
      role: found.role,
      user: found
    };
  }

  // First user fallback: if the list has only super admin and someone logs in for the first time,
  // we still require them to be added or approved by the administrator.
  return {
    authorized: false,
    reason: 'Conta Google não encontrada na lista de permissões do Administrador'
  };
}

/**
 * Check if a Google email is an administrator
 */
export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  const authCheck = isUserAuthorized(email);
  return authCheck.authorized && authCheck.role === 'admin';
}
