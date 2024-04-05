'use client'

import {Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,} from "@/components/ui/index"
import { useState } from "react"

interface PaginationGenericProps {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    setCurrentPage: (page: number) => void;
}

const PaginationGeneric = () => {
    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 6;

    const handlePageChange = (page: number) => {
        console.log(page)
        setCurrentPage(page);
    }

    return (
        <Pagination className="flex justify-end" >
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="/conteudo/publicacoes/perfis-municipais/1">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" isActive>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem >
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export {PaginationGeneric}