// src/components/orders/Pagination.tsx
// "<-  Page 1 of 2  ->". The parent owns currentPage.

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav className="pagination">
      <button
        type="button"
        aria-label="Previous page"
        data-action="page-previous"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ←
      </button>

      <span className="muted">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        aria-label="Next page"
        data-action="page-next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        →
      </button>
    </nav>
  );
}