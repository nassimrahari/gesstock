import React, { useState,useEffect } from 'react';
import { updateUser, fetchUsersItem } from '../../api/userService';



import { usePopup } from './UserPopupContext'; // Importer le context


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import SelectCommand from '../SelectCommand';

const UserUpdateComponent = () => {
    const [id, setId] = useState('');
    const [fieldUsername, setFieldUsername] = useState('');
const [fieldEmail, setFieldEmail] = useState('');
const [fieldPassword, setFieldPassword] = useState('');

     

    const { openUpdate, setOpenUpdate, triggerRefresh,itemEditId } = usePopup(); // Utiliser le contexte

    

    const handleUpdate = async () => {
        await updateUser(id, { username:fieldUsername, email:fieldEmail, password:fieldPassword });
        setOpenUpdate(false);
        triggerRefresh(); // Déclencher le rafraîchissement
    };


    useEffect(() => {
        const fetchItem = async () => {
            const result = await fetchUsersItem(itemEditId);
            setId(result.id);

            

setFieldUsername(result.username);

setFieldEmail(result.email);

setFieldPassword(result.password);
           
        };
        fetchItem();
    }, [itemEditId]);

    return (

        <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>


            <DialogContent className="sm:max-w-[425px]"
             style={{
                    maxHeight:"calc(100vh - 80px)",
                    overflowY:"scroll"
                }}
            >
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <input hidden type="text" placeholder="ID" value={id} onChange={e => setId(e.target.value)} className="border p-2 mb-2" />
                    

             <div className="items-center gap-4">
             <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
               
                 
                        <Input
                           type="email"
                           id="username"
                           value={fieldUsername}
                           onChange={e => setFieldUsername(e.target.value)} 
                           className="col-span-3"
                        />                
                
            </div>
            


             <div className="items-center gap-4">
             <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
               
                 
                        <Input
                           id="email"
                           value={fieldEmail}
                           onChange={e => setFieldEmail(e.target.value)} 
                           className="col-span-3"
                        />                
            
            </div>
            


             <div className="items-center gap-4">
             <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
               
                 
                        <Input
                           id="password"
                           value={fieldPassword}
                           onChange={e => setFieldPassword(e.target.value)} 
                           className="col-span-3"
                        />                
            
            </div>
            

                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenUpdate(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate}>Submit</Button>
                </DialogFooter>
            </DialogContent>
          
        </Dialog>
    );
};

export default UserUpdateComponent;
