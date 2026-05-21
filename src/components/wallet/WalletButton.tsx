import { Wallet } from 'lucide-react';
import { useStore } from '../../store';

export function WalletButton() {
  const { walletAddress, setWalletAddress } = useStore();

  const handleConnect = () => {
    if (walletAddress) {
      setWalletAddress(null);
    } else {
      setWalletAddress('0x' + Math.random().toString(16).slice(2, 42));
    }
  };

  return (
    <button
      onClick={handleConnect}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
        walletAddress 
          ? 'bg-gray-50 dark:bg-[#1A1D27] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' 
          : 'bg-[#2563EB] dark:bg-[#3B82F6] border-transparent text-white hover:bg-blue-700 dark:hover:bg-blue-500 shadow-sm'
      }`}
    >
      <Wallet className="w-4 h-4" />
      {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
    </button>
  );
}
