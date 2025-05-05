import React, { useState,useEffect } from 'react';
import { updateClient, fetchClientsItem } from '../../services/clientService';




import { usePopup } from './ClientPopupContext'; // Importer le context
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"



import SelectCommand from '../SelectCommand';

const ClientUpdateComponent = () => {
    const [id, setId] = useState('');
    const [fieldName, setFieldName] = useState('');
const [fieldContact_email, setFieldContact_email] = useState('');
const [fieldPhone_number, setFieldPhone_number] = useState('');
    const [error, setError] = useState({});  // Add error handling state


    
    
    

    

    const { openUpdate, setOpenUpdate, triggerRefresh,itemEditId } = usePopup(); // Utiliser le contexte

    

    const handleUpdate = async () => {
        let valid = true;

        if (!fieldName) {
            setError(prev => { return { ...prev, 'name': 'Name is required.' }; }); // Set specific error message
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['name']; return newState; }); // Remove the error if valid
        }

    if (!valid) return; 



        // Only proceed if valid

        const data={ name:fieldName, contact_email:fieldContact_email, phone_number:fieldPhone_number }
        

        await updateClient(id, data)
          .then(()=>{
          
            setOpenUpdate(false);
            triggerRefresh(); 
        })
        .catch((error)=>{
             if(error.response.status == 400){
                console.log(error.response.data)
                
                if(error.response.data.messages){
                 setError(error.response.data.messages)
                }
               
            }
            
        });
        
        
        
    };


    useEffect(() => {
        const fetchItem = async () => {
            const result = await fetchClientsItem(itemEditId);
            setId(result.id);

            

setFieldName(result.name);

setFieldContact_email(result.contact_email);

setFieldPhone_number(result.phone_number);

             
           
        };

        if(itemEditId)fetchItem();
        
    }, [itemEditId,openUpdate]);

    return (

        <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>


            <DialogContent className="sm:max-w-[420px]"
             style={{
                    maxHeight:"calc(100vh - 80px)",
                    overflowY:"auto"
                }}
            >
                <DialogHeader>
                    <DialogTitle>Edit Client</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     {error?.all && (
                <>
                    {error?.all.map((item_error)=>(
                        <p className="text-red-600">{item_error}</p>
                    ))}
                </>
            ) }  
            
                    <input hidden type="text" placeholder="ID" value={id} onChange={e => setId(e.target.value)} className="border p-2 mb-2" />
                    

            <div className="items-center gap-4">
                
                
                            <Label htmlFor="name" className="text-right">
                    Name
                </Label>
                
                            
                <Input
                   id="name"
                   value={fieldName}
                   onChange={e => setFieldName(e.target.value)} 
                   className="col-span-3"
                />                
             
                        
                {error['name'] && <p className="text-red-600">{error['name']}</p>}  
            </div>
            


            <div className="items-center gap-4">
                
                
                            <Label htmlFor="contact_email" className="text-right">
                    Contact Email
                </Label>
                
                            
                <Input
                   type="email"
                   id="contact_email"
                   value={fieldContact_email}
                   onChange={e => setFieldContact_email(e.target.value)} 
                   className="col-span-3"
                />                
                 
                        
                {error['contact_email'] && <p className="text-red-600">{error['contact_email']}</p>}  
            </div>
            


            <div className="items-center gap-4">
                
                
                            <Label htmlFor="phone_number" className="text-right">
                    Phone Number
                </Label>
                
                            
                <Input
                   id="phone_number"
                   value={fieldPhone_number}
                   onChange={e => setFieldPhone_number(e.target.value)} 
                   className="col-span-3"
                />                
             
                        
                {error['phone_number'] && <p className="text-red-600">{error['phone_number']}</p>}  
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

export default ClientUpdateComponent;
