import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartAPIService } from '@/lib/services/chart/chartAPIService';

const IDHTable = () => {
    const [tableData, setTableData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const chartService = ChartAPIService.getInstance();
                const rawData = await chartService.getAllIndicatorsStateChartData();

                // Pegando os estados e IDH
                const transformedData = rawData.slice(1).map((row: string[]) => ({
                    state: row[2],
                    idh: row[3],
                }));

                setTableData(transformedData);
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full h-full overflow-auto">
            <Table className="border-collapse">
                <TableHeader>
                    <TableRow>
                        <TableHead className="py-1 px-2">Estado</TableHead>
                        <TableHead className="py-1 px-2">IDH</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData.map((row, index) => (
                        <TableRow key={index}>
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