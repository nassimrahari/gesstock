import React, { useState, useEffect } from 'react';
import { fetchPurchaseLines, deletePurchaseLine } from '../../services/purchaselineService';
import { usePopup } from './PurchaseLinePopupContext'; // Importer le contexte
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"

import { BACKEND_SERVER } from '../../conf';

import { Loader2, Trash, Edit3 } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import PurchaseLineListPdfComponent from './PurchaseLineListPdfComponent';

const PurchaseLineList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // You can adjust the number of items per page
    const { refreshList, setItemEditId, setOpenUpdate } = usePopup();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            const result = await fetchPurchaseLines();

            setItems(result);

            setLoading(false);
        };
        fetchItems();
    }, [refreshList]);

    const handleDelete = async (id) => {
        await deletePurchaseLine(id);
        setItems(items.filter(item => item.id !== id));
        setConfirmDelete(false); // Close the dialog after deletion
    };

    const handleEdit = async (id) => {
        setItemEditId(id);
        setOpenUpdate(true);
    };

    const filteredItems = items.filter(item => 
        Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    if (loading) return (
        <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );

    return (
        <div>
            <PurchaseLineListPdfComponent purchaselines={items} />
            <Input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border w-full dark:bg-gray-900 dark:text-white"

            />
            
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Purchase</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map(item => (
                        <TableRow key={item.id} className="border-b dark:text-white">
                            <TableCell>{item.id}</TableCell>
                            
                                <TableCell>{item.purchase.repr}</TableCell>
                    
                                <TableCell>{item.product.repr}</TableCell>
                    
                            <TableCell>{item.quantity}</TableCell>
                
                            <TableCell>{item.price}</TableCell>
                
                            <TableCell>
                            <div className="flex gap-2">
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => {
                                        setItemToDelete(item.id);
                                        setConfirmDelete(true);
                                    } }
                                >
                                    <Trash className="h-5 w-5 "/>
                                </Button>
                                <Button 
                                    size="sm"
                                    onClick={() => handleEdit(item.id)}
                                    className="ml-2"
                                >
                                    <Edit3 className="h-5 w-5 "/>
                                </Button>
                            </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious  className="dark:text-white" href="#" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink className={`dark:text-white ${currentPage === index + 1?'dark:bg-gray-900':''}`} href="#" onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext  className="dark:text-white" href="#" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-lg font-bold">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this item?</p>
                        <div className="mt-4">
                            <Button onClick={() => handleDelete(itemToDelete)} variant="destructive">Yes, Delete</Button>
                            <Button onClick={() => setConfirmDelete(false)} className="ml-2">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseLineList;
