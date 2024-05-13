"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/index";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaginationGenericProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
}

const PaginationGeneric: React.FC<PaginationGenericProps> = ({
  itemsPerPage,
  totalItems,
  setCurrentPage,
}) => {
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Pagination className="flex justify-end mb-[10%]">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <PaginationItem
              key={`pagination-item-${pageNumber}`}
              className={pageNumber > 1 ? "hidden sm:flex" : ""}
            >
              <PaginationLink
                onClick={() => handlePageChange(pageNumber)}
                // isActive={router.query.page === pageNumber.toString()}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export { PaginationGeneric };
