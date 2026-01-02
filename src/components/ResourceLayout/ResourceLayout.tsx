import { useState, type ReactNode } from "react";
import { Alert } from "@/components/Alert/Alert";
import { Loading } from "@/components/Loading/Loading";
import { useSelectionStore } from "@/store/useSelectionStore";
import { ComparisonModal } from "@/components/ComparisonModal/ComparisonModal";

type Props = {
  title: string;
  isLoading: boolean;
  error: Error | null;
  children: ReactNode;
};

export const ResourceLayout = ({ title, isLoading, error, children }: Props) => {
  const { selectedItems, clearSelection } = useSelectionStore();
  const [showCompare, setShowCompare] = useState(false);

  if (isLoading) return <Loading />;
  if (error) return <Alert message={error.message} type="error" />;

  return (
    <div className="container mx-auto p-4 pb-24">
      <h1 className="text-4xl md:text-5xl font-bold text-warning mb-8 drop-shadow-md text-center">
        {title}
      </h1>
      {children}

      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral/95 backdrop-blur-md p-3 md:p-4 border-t border-warning/20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-50 animate-slide-up">
          <div className="container mx-auto flex justify-between items-center gap-2">
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar items-center flex-1 pr-2">
              {selectedItems.map((item) => (
                <div 
                  key={item.id} 
                  className="badge badge-warning badge-outline gap-1 py-3 md:py-4 px-2 md:px-4 flex-shrink-0 max-w-[120px] md:max-w-none"
                >
                  <span className="opacity-50 text-[8px] md:text-[10px] uppercase hidden xs:inline">{item.type}</span>
                  <span className="font-bold text-xs truncate">{item.name}</span>
                </div>
              ))}
              {selectedItems.length === 1 && (
                 <span className="text-[10px] opacity-50 italic whitespace-nowrap hidden sm:inline">Select one more...</span>
              )}
            </div>
            
            <div className="flex gap-2 shrink-0">
              <button className="btn btn-xs md:btn-sm btn-ghost text-error" onClick={clearSelection}>
                Clear
              </button>
              <button 
                className="btn btn-xs md:btn-sm btn-warning"
                disabled={selectedItems.length < 2} 
                onClick={() => setShowCompare(true)}
              >
                Compare ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompare && selectedItems.length === 2 && (
        <ComparisonModal 
            items={selectedItems} 
            onClose={() => setShowCompare(false)} 
        />
      )}
    </div>
  );
};