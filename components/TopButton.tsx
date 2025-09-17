//components/TopButton.tsx
interface TopButtonProps {
    phase: string;
    onClick: () => void;
  }
  
  const TopButton: React.FC<TopButtonProps> = ({ phase, onClick }) => (
    <div className="absolute top-8 right-8 z-20">
      <button
        onClick={onClick}
        className={`flex items-center justify-center px-4 py-2 rounded-full font-medium text-sm font-semibold ${
          phase === 'showing-output' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-white text-emerald-600 border border-emerald-200'
        }`}
      >
        {phase === 'showing-output' ? 'View FHIR' : 'FHIR'}
      </button>
    </div>
  );
  
  export default TopButton;