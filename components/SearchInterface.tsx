//components/SearchInterface.tsx
import { Search } from 'lucide-react';

interface SearchInterfaceProps {
  displayedUserInput: string;
  isTyping: boolean;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ displayedUserInput, isTyping }) => (
  <div className="flex-1 relative mb-6">
    <input
      type="text"
      value={displayedUserInput}
      readOnly
      placeholder="Auto-typing demonstration..."
      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white/80 backdrop-blur-sm cursor-default font-mono min-h-[36px]"
    />
    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
    {isTyping && (
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
        <div className="w-0.5 h-4 bg-blue-500 animate-pulse" />
      </div>
    )}
  </div>
);

export default SearchInterface;