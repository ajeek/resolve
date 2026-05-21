import { Wallet } from 'lucide-react';
import { useStore } from '../../store';

export function WalletButton() {
  const { walletAddress, setWalletAddress } = useStore();

  const handleConnect = () => {
    if (walletAddress) {
      setWalletAddress(null);
    } else {
      // Mock wallet connection
      setWalletAddress('0x' + Math.random().toString(16).slice(2, 42));
    }
  };

  return (
    <button
      onClick={handleConnect}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
        walletAddress 
          ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' 
          : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 shadow-sm'
      }`}
    >
      <Wallet className="w-4 h-4" />
      {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
    </button>
  );
}
