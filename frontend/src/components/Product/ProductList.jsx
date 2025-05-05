import React, { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct } from '../../services/productService';
import { usePopup } from './ProductPopupContext'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BACKEND_SERVER } from '../../conf';
import { Loader2, Trash, Edit3 } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ProductListPdfComponent from './ProductListPdfComponent';

const ProductList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [viewMode, setViewMode] = useState('card'); // New state for view mode
    const { refreshList, setItemEditId, setOpenUpdate } = usePopup();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            const result = await fetchProducts();
            setItems(result);
            setLoading(false);
        };
        fetchItems();
    }, [refreshList]);

    const handleDelete = async (id) => {
        await deleteProduct(id);
        setItems(items.filter(item => item.id !== id));
        setConfirmDelete(false);
    };

    const handleEdit = (id) => {
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
            <ProductListPdfComponent products={items} />
            <Input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border w-full dark:bg-gray-900 dark:text-white"
            />

            <div className="flex justify-between mb-4">
                <Button onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}>
                    Switch to {viewMode === 'card' ? 'Table' : 'Card'} View
                </Button>
            </div>

            {viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map(item => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105">
                            {item.image && (
                                <div className="h-48 overflow-hidden">
                                    <img src={`${BACKEND_SERVER}${item.image}`} alt={item.repr} />
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2 dark:text-white">{item.repr}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{item.description}</p>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    <span>Price: {item.price} - Quantity: {item.quantity}</span>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button 
                                        onClick={() => {
                                            setItemToDelete(item.id);
                                            setConfirmDelete(true);
                                        }}
                                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                                    >
                                        <Trash className="h-5 w-5 text-red-500" />
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(item.id)}
                                        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200"
                                    >
                                        <Edit3 className="h-5 w-5 text-blue-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {item.image && <img src={`${BACKEND_SERVER}${item.image}`} alt={item.repr} className="h-16 w-16 object-cover" />}
                                </TableCell>
                                <TableCell>{item.repr}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button onClick={() => handleEdit(item.id)}>Edit</Button>
                                        <Button variant="destructive" onClick={() => {
                                            setItemToDelete(item.id);
                                            setConfirmDelete(true);
                                        }}>Delete</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious className="dark:text-white" href="#" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink className={`dark:text-white ${currentPage === index + 1 ? 'dark:bg-gray-900' : ''}`} href="#" onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext className="dark:text-white" href="#" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
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

export default ProductList;