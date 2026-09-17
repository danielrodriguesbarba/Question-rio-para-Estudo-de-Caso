import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  UserCheck, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  Mail,
  User,
  Shield,
  Clock,
  ToggleLeft,
  ToggleRight,
  RefreshCw
} from 'lucide-react';
import { 
  AuthorizedUser, 
  UserRole, 
  getAuthorizedUsers, 
  addAuthorizedUser, 
  updateAuthorizedUser, 
  removeAuthorizedUser,
  getAccessControlConfig,
  saveAccessControlConfig
} from '../utils/accessControl';

interface AdminAccessModalProps {
  onClose: () => void;
  currentUserEmail?: string;
  onUsersUpdated?: () => void;
}

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  onClose,
  currentUserEmail,
  onUsersUpdated
}) => {
  const [users, setUsers] = useState<AuthorizedUser[]>(() => getAuthorizedUsers());
  const [config, setConfig] = useState(() => getAccessControlConfig());
  
  // New user form state
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('educador');
  const [newNotes, setNewNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Status feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const refreshList = () => {
    const updated = getAuthorizedUsers();
    setUsers(updated);
    if (onUsersUpdated) onUsersUpdated();
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!newEmail.trim()) {
      setFeedback({ type: 'error', message: 'Informe um e-mail Google válido.' });
      return;
    }

    const result = addAuthorizedUser(
      newEmail,
      newRole,
      newName,
      currentUserEmail || 'Administrador',
      newNotes
    );

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setNewEmail('');
      setNewName('');
      setNewNotes('');
      setNewRole('educador');
      refreshList();
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  const handleToggleRole = (user: AuthorizedUser) => {
    const newRole: UserRole = user.role === 'admin' ? 'educador' : 'admin';
    const ok = updateAuthorizedUser(user.email, { role: newRole });
    if (ok) {
      setFeedback({ 
        type: 'success', 
        message: `Papel de ${user.email} alterado para ${newRole === 'admin' ? 'Administrador' : 'Educador'}.` 
      });
      refreshList();
    }
  };

  const handleRemoveUser = (email: string) => {
    if (confirm(`Tem certeza de que deseja revogar o acesso da conta Google "${email}"?`)) {
      const res = removeAuthorizedUser(email);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        refreshList();
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }
  };

  const handleToggleRestrictedMode = () => {
    const updated = saveAccessControlConfig({ restrictedMode: !config.restrictedMode });
    setConfig(updated);
    setFeedback({
      type: 'success',
      message: updated.restrictedMode
        ? 'Acesso restrito ativado: Apenas contas cadastradas poderão entrar.'
        : 'Acesso livre ativado: Qualquer conta Google poderá entrar no sistema.'
    });
    if (onUsersUpdated) onUsersUpdated();
  };

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return u.email.toLowerCase().includes(q) || (u.nome || '').toLowerCase().includes(q);
  });

  const adminCount = users.filter(u => u.role === 'admin').length;
  const educatorCount = users.filter(u => u.role === 'educador').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base sm:text-lg">
                  Painel de Administração & Gestão de Acessos
                </h3>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-indigo-500 text-white tracking-wider">
                  Admin ACL
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Cadastre e gerencie as contas Google autorizadas a acessar o Questionário BNCC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Access Mode Toggle & Quick Stats */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Modo de Segurança:</span>
              <button
                onClick={handleToggleRestrictedMode}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                  config.restrictedMode
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                }`}
                title="Clique para alternar entre acesso restrito e aberto"
              >
                {config.restrictedMode ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Restrito a Contas Cadastradas</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Acesso Livre (Qualquer Google)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <strong>{adminCount}</strong> Admin(s)
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <strong>{educatorCount}</strong> Educador(es)
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`px-4 py-2.5 text-xs font-medium flex items-center justify-between ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-b border-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-6">
          
          {/* Add User Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>Cadastrar Nova Conta Google Autorizada</span>
            </h4>

            <form onSubmit={handleAddUser} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Email Google */}
                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    E-mail da Conta Google *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="exemplo@gmail.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Nome do Educador / Usuário */}
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nome / Identificação
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ex: Prof. Mariana - Turma B"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Papel / Nível de Acesso */}
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nível de Permissão
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="educador">Educador(a)</option>
                    <option value="admin">Administrador(a)</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Conceder Permissão de Acesso</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Registered Accounts */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Contas com Acesso Autorizado ({users.length})</span>
              </h4>

              {/* Search in user list */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar conta autorizada..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white shadow-2xs">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Nenhuma conta encontrada com o termo pesquisado.
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user.role === 'admin';
                  const isCurrentUser = currentUserEmail && user.email.toLowerCase() === currentUserEmail.toLowerCase();
                  const isMasterSuperAdmin = user.email.toLowerCase() === 'danielcardosobarba@gmail.com';

                  return (
                    <div key={user.email} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition">
                      <div className="space-y-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {user.email}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            isAdmin 
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {isAdmin ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                            {isAdmin ? 'Administrador' : 'Educador(a)'}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              Sua Conta Atual
                            </span>
                          )}
                          {isMasterSuperAdmin && (
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              Admin Principal
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 flex items-center flex-wrap gap-2">
                          {user.nome && <span className="font-medium text-slate-700">{user.nome}</span>}
                          {user.nome && <span>•</span>}
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Adicionado em {new Date(user.adicionadoEm).toLocaleDateString('pt-BR')}
                          </span>
                          {user.adicionadoPor && (
                            <span>por {user.adicionadoPor}</span>
                          )}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {/* Toggle role button */}
                        {!isMasterSuperAdmin && (
                          <button
                            onClick={() => handleToggleRole(user)}
                            className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition cursor-pointer"
                            title={`Mudar para ${isAdmin ? 'Educador' : 'Administrador'}`}
                          >
                            Tornar {isAdmin ? 'Educador' : 'Admin'}
                          </button>
                        )}

                        {/* Remove button */}
                        {!isMasterSuperAdmin && (
                          <button
                            onClick={() => handleRemoveUser(user.email)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Revogar Permissão de Acesso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{users.length} conta(s) Google autorizada(s) no sistema</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            Concluir & Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
