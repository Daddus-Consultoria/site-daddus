import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface IndicatorsTableProps {
    data: Array<[string, number]>;
    headers: [string, string];
}

const IndicatorsTable: React.FC<IndicatorsTableProps> = ({ data, headers }) => {
    return (
        <div className="w-full h-full overflow-auto">
            <Table className="border-collapse">
                <TableHeader>
                    <TableRow>
                        <TableHead className="py-1 px-2 bg-primary text-primary-foreground text-center font-bold">{headers[0]}</TableHead>
                        <TableHead className="py-1 px-2 bg-primary text-primary-foreground text-center font-bold">{headers[1]}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                            <TableCell className="py-1 px-2 text-center">{row[0]}</TableCell>
                            <TableCell className="py-1 px-2 text-center">{row[1]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default IndicatorsTable;