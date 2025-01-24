"use client";

import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <PaginationUI>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => onPageChange(currentPage - 1)}
            />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i + 1}>
            {i + 1 === 1 ||
            i + 1 === totalPages ||
            (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1) ? (
              <PaginationLink
                href="#"
                onClick={() => onPageChange(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            ) : (
              (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) && (
                <span>...</span>
              )
            )}
          </PaginationItem>
        ))}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationUI>
  );
};

export default Pagination;
