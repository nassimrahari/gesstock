import React, { useState, useEffect } from 'react';
import { fetchUsers, deleteUser } from '../../api/userService';
import { usePopup } from './UserPopupContext'; // Importer le contexte

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

const UserList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { refreshList,setItemEditId,setOpenUpdate } = usePopup(); // Utiliser le contexte


    useEffect(() => {
        const fetchItems = async () => {
            const result = await fetchUsers();
            setItems(result);
            setLoading(false);
        };
        fetchItems();
    }, [refreshList]);

    const handleDelete = async (id) => {
        await deleteUser(id);
        setItems(items.filter(item => item.id !== id));
    };

    const handleEdit = async (id) => {
        setItemEditId(id);
        setOpenUpdate(true);
    };

     if (loading) return (
        <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                     <TableHead>Username</TableHead><TableHead>Email</TableHead><TableHead>Password</TableHead> 
                    <TableHead>Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
                {items.map(item => (
                    <TableRow key={item.id} className="border-b">
                        <TableCell>{item.id}</TableCell>
                         <TableCell>{item.username}</TableCell><TableCell>{item.email}</TableCell><TableCell>{item.password}</TableCell> 
                        <TableCell>
                            <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                            >
                                Delete
                            </Button>
                            <Button 
                              
                                size="sm"
                                onClick={() => handleEdit(item.id)}
                            >
                                Edit
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
           </TableBody>
        </Table>
    );
};

export default UserList;
