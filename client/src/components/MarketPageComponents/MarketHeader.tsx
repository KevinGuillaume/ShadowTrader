import { ArrowLeft } from 'lucide-react';

interface MarketHeaderProps {
  title: string;
  onBack: () => void;
}

const MarketHeader: React.FC<MarketHeaderProps> = ({ title, onBack }) => (
  <header className="sticky top-0 z-20 bg-gray-900 border-b border-gray-800 px-4 py-4 md:px-8">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-300 hover:text-white transition">
        <ArrowLeft size={20} />
        <span>Back to Markets</span>
      </button>
      <h1 className="text-xl md:text-2xl font-bold truncate max-w-[60%] text-center">{title}</h1>
      <div className="w-10" />
    </div>
  </header>
);

export default MarketHeader;