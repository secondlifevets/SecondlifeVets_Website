import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  pageSizeOptions?: number[];
  disabled?: boolean;
}

export default function Pagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  disabled = false,
}: PaginationProps) {
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalCount);
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex items-center justify-end gap-6 p-4 border-t border-gray-100 bg-white text-sm text-gray-500 rounded-b-3xl">
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={disabled}
          className="bg-transparent font-medium text-dark focus:outline-none cursor-pointer disabled:opacity-50"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <span>
          {totalCount === 0 ? "0 - 0 of 0" : `${start} - ${end} of ${totalCount}`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0 || disabled}
          className={clsx(
            "p-1 rounded-lg transition-colors flex items-center justify-center",
            page === 0 || disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-100 hover:text-dark"
          )}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1 || disabled}
          className={clsx(
            "p-1 rounded-lg transition-colors flex items-center justify-center",
            page >= totalPages - 1 || disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-100 hover:text-dark"
          )}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
