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
  currentPage,
}) => {
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Pagination className="flex justify-start ">
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 && (
            <PaginationPrevious onClick={()=>{
              setCurrentPage(currentPage - 1)
            }}/>
          )}
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
                {currentPage}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        { currentPage*itemsPerPage <= totalItems ?
          (
            <PaginationItem>
              <PaginationNext  onClick={()=>{
                setCurrentPage(currentPage + 1)
              }} />
            </PaginationItem>
          ) : null
        }
      </PaginationContent>
    </Pagination>
  );
};

export { PaginationGeneric };
