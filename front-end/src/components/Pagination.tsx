import React from "react";
import { Button } from "@/components/ui/button"; // Import Button from Shadcn components
import { cn } from "@/lib/utils"; // Utility function for class merging if needed
import { PaginationEllipsis } from "./ui/pagination";
import { useTheme } from "@/ThemeContext";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Function to handle page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Determine the page numbers to show around the current page
  const pageNumbers = [
    currentPage - 1 > 1 ? currentPage - 1 : null,
    currentPage,
    currentPage + 1 < totalPages ? currentPage + 1 : null,
  ].filter((page): page is number => page !== null);

  const { darkMode } = useTheme();

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      {/* Previous Button */}
      <Button
        className={darkMode ? 'bg-secondary text-gray-200': 'bg-gray-200 text-black'}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"}
      </Button>

      {/* Always show the first page button */}
      {currentPage > 1 && (
        <>
          <Button
            onClick={() => handlePageChange(1)}
            className={cn(
              darkMode
                ? "bg-secondary text-gray-200"
                : "bg-gray-200 text-black",
              currentPage === 1 && "bg-primary text-white"
            )}
          >
            1
          </Button>
          {/* Ellipsis after the first page if needed */}
          {currentPage > 3 && <PaginationEllipsis />}
        </>
      )}

      {/* Page Numbers (Previous, Current, Next) */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          className={cn(
            darkMode ? "bg-secondary text-gray-200" : "bg-gray-200 text-black",
            page === currentPage &&
              (darkMode ? "bg-gray-200 text-black" : "bg-primary text-white")
          )}
        >
          {page}
        </Button>
      ))}

      {/* Always show the last page button */}
      {currentPage < totalPages && (
        <>
          {/* Ellipsis before the last page if needed */}
          {currentPage < totalPages - 2 && (
            <PaginationEllipsis className={darkMode ? "" : "text-gray-300"} />
          )}
          <Button
            onClick={() => handlePageChange(totalPages)}
            className={cn(
              darkMode
                ? "bg-secondary text-gray-200"
                : "bg-gray-200 text-black",
              currentPage === totalPages && "bg-primary text-white"
            )}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      <Button
        className={darkMode ? 'bg-secondary text-gray-200': 'bg-gray-200 text-black'}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {">"}
      </Button>
    </div>
  );
};

export default Pagination;
