import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface IDHTableProps {
    data: any[];
}

const IDHTable: React.FC<IDHTableProps> = ({ data }) => {
    return (
        <div className="w-full h-full overflow-auto">
            <Table className="border-collapse">
                <TableHeader>
                    <TableRow>
                        <TableHead className="py-1 px-2 bg-primary text-primary-foreground text-center font-bold">LOCAL</TableHead>
                        <TableHead className="py-1 px-2 bg-primary text-primary-foreground text-center font-bold">IDH</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                            <TableCell className="py-1 px-2">{row.state}</TableCell>
                            <TableCell className="py-1 px-2">{row.idh}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default IDHTable;