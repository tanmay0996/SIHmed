//components/ProgressIndicator.tsx
interface ProgressIndicatorProps {
    currentIndex: number;
    total: number;
  }
  
  const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentIndex, total }) => (
    <div className="flex justify-center mt-4 space-x-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-1 rounded-full transition-all duration-200 ${
            index === currentIndex
              ? 'w-4 bg-emerald-500'
              : 'w-1.5 bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
  
  export default ProgressIndicator;