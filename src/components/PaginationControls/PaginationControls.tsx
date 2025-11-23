type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
};

export const PaginationControls = ({ page, totalPages, onPrev, onNext, className = "" }: Props) => (
  <div className={`mt-4 flex items-center gap-2 ${className}`}>
    <button className="btn btn-sm" onClick={onPrev} disabled={page === 1}>
      Prev
    </button>

    <span className="px-2 py-1">Page {page} / {totalPages}</span>

    <button className="btn btn-sm" onClick={onNext} disabled={page === totalPages}>
      Next
    </button>
  </div>
);
