import React from 'react';
import { 
  ShieldAlert, 
  LogOut, 
  RefreshCw, 
  Mail, 
  UserX, 
  CheckCircle, 
  FolderOpen 
} from 'lucide-react';
import { User } from 'firebase/auth';

interface UnauthorizedScreenProps {
  user: User;
  onLogout: () => Promise<void>;
  onCheckAgain: () => void;
}

export const UnauthorizedScreen: React.FC<UnauthorizedScreenProps> = ({
  user,
  onLogout,
  onCheckAgain
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">
              Questionário BNCC
            </h1>
            <p className="text-xs text-slate-400">
              Controle de Acesso por Permissão
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair da Conta</span>
        </button>
      </header>

      {/* Center Card */}
      <main className="w-full max-w-lg mx-auto px-4 py-6 relative z-10 flex flex-col items-center justify-center">
        <div className="w-full bg-slate-800/90 backdrop-blur-md rounded-2xl border border-rose-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Acesso Não Autorizado
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              Sua conta Google foi autenticada, porém ainda não possui permissão concedida pelo administrador para acessar este programa.
            </p>
          </div>

          {/* Account Details Box */}
          <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 space-y-2">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              Conta Conectada
            </div>
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Avatar'}
                  className="w-10 h-10 rounded-full border border-slate-600"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                  <UserX className="w-5 h-5" />
                </div>
              )}
              <div className="overflow-hidden">
                <div className="font-bold text-white text-sm truncate">
                  {user.displayName || 'Usuário Google'}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-xs text-slate-300 bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-2.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Como obter acesso:</span>
            </div>
            <p className="text-slate-300 leading-normal">
              Solicite ao administrador do sistema que cadastre o e-mail <strong className="text-indigo-300">{user.email}</strong> no Painel de Administração de Acessos.
            </p>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
              Administrador Principal: <span className="font-mono text-slate-300">danielcardosobarba@gmail.com</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onCheckAgain}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Verificar Permissão</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Trocar Conta Google</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-xs text-slate-500 relative z-10">
        Base Nacional Comum Curricular (BNCC) • Controle de Acesso Restrito
      </footer>
    </div>
  );
};
