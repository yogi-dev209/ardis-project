interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  activeColorClass?: string;
  unit?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  activeColorClass = 'bg-gray-700',
  unit = 'data',
}: PaginationProps) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [];
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex items-center justify-between">
      <div className="text-[11px] text-gray-600">
        {totalItems === 0
          ? 'Tidak ada data'
          : `Menampilkan ${start}–${end} dari ${totalItems} ${unit}`}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          {getPageNumbers().map((page, i) =>
            page === '...' ? (
              <span key={`ellipsis-${i}`} className="px-1.5 text-[11px] text-gray-400 select-none">
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page as number)}
                className={`min-w-[26px] px-2 py-1 text-[11px] rounded transition-colors ${
                  currentPage === page
                    ? `${activeColorClass} text-white`
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
