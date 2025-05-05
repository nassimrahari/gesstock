import React, { useState,useEffect } from 'react';
import { updateCategory, fetchCategorysItem } from '../../services/categoryService';




import { usePopup } from './CategoryPopupContext'; // Importer le context
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"



import SelectCommand from '../SelectCommand';

const CategoryUpdateComponent = () => {
    const [id, setId] = useState('');
    const [fieldName, setFieldName] = useState('');
const [fieldDescription, setFieldDescription] = useState('');
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

        const data={ name:fieldName, description:fieldDescription }
        

        await updateCategory(id, data)
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
            const result = await fetchCategorysItem(itemEditId);
            setId(result.id);

            

setFieldName(result.name);

setFieldDescription(result.description);

             
           
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
                    <DialogTitle>Edit Category</DialogTitle>
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
                
                
                            <Label htmlFor="description" className="text-right">
                    Description
                </Label>
                
                            
                <Input
                   id="description"
                   value={fieldDescription}
                   onChange={e => setFieldDescription(e.target.value)} 
                   className="col-span-3"
                />                
             
                        
                {error['description'] && <p className="text-red-600">{error['description']}</p>}  
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

export default CategoryUpdateComponent;
