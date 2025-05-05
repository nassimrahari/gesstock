import React, { useState,useEffect } from 'react';
import { createUser } from '../../api/userService';



import { usePopup } from './UserPopupContext'; // Importer le context



import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import SelectCommand from '../SelectCommand';

const UserCreateComponent = () => {
    const [fieldUsername, setFieldUsername] = useState('');
const [fieldEmail, setFieldEmail] = useState('');
const [fieldPassword, setFieldPassword] = useState('');

    

    const { openCreate, setOpenCreate, triggerRefresh } = usePopup(); // Utiliser le contexte

    

    const handleCreate = async () => {
        await createUser({ username:fieldUsername, email:fieldEmail, password:fieldPassword });
        
        setOpenCreate(false);
        triggerRefresh(); // Déclencher le rafraîchissement

    };

    return (
         <Dialog open={openCreate} onOpenChange={setOpenCreate}>


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
                    <Button variant="outline" onClick={() => setOpenCreate(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
          
        </Dialog>
    );
};

export default UserCreateComponent;
