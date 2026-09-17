import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  pendingCount: number;
  onSyncClick?: () => void;
  isSyncing?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  pendingCount,
  onSyncClick,
  isSyncing = false
}) => {
  const isOnline = useOnlineStatus();

  if (isOnline && pendingCount === 0) {
    return null;
  }

  if (!isOnline) {
    return (
      <aside
        aria-label="Status de Conexão Offline"
        className="fixed bottom-4 left-4 z-40 max-w-sm rounded-xl bg-amber-500 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-xl flex items-center gap-3 border border-amber-400"
      >
        <WifiOff className="w-4 h-4 flex-shrink-0 animate-pulse" />
        <div className="flex-1 leading-tight">
          <p className="font-bold">Modo Offline Ativo</p>
          <p className="text-amber-100 text-xs">
            {pendingCount > 0
              ? `${pendingCount} avaliação(ões) salva(s) no aparelho.`
              : 'O questionário funciona normalmente sem conexão.'}
          </p>
        </div>
      </aside>
    );
  }

  // Online with pending sync items
  return (
    <aside
      aria-label="Sincronização Pendente"
      className="fixed bottom-4 left-4 z-40 max-w-sm rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-xl flex items-center gap-3 border border-slate-700"
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      <div className="flex-1 leading-tight">
        <p className="font-bold">Online</p>
        <p className="text-slate-300 text-xs">
          {pendingCount} registro(s) pendente(s) de envio.
        </p>
      </div>
      {onSyncClick && (
        <button
          id="btn-offline-sync"
          onClick={onSyncClick}
          disabled={isSyncing}
          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sincronizando...' : 'Enviar Agora'}</span>
        </button>
      )}
    </aside>
  );
};
