import React, { useState,useEffect } from 'react';
import { updateProduct, fetchProductsItem } from '../../services/productService';


import { fetchCategorys } from '../../services/categoryService';



import { usePopup } from './ProductPopupContext'; // Importer le context
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"


import objectToFormData from '@/lib/objectToFormData';
import SelectCommand from '../SelectCommand';

const ProductUpdateComponent = () => {
    const [id, setId] = useState('');
    const [fieldName, setFieldName] = useState('');
const [fieldPrice, setFieldPrice] = useState('');
const [fieldCategory, setFieldCategory] = useState('');
const [fieldImage, setFieldImage] = useState('');
    const [error, setError] = useState({});  // Add error handling state


    
    
    

    
    const [categorysList, setCategorysList] = useState([]);


    const { openUpdate, setOpenUpdate, triggerRefresh,itemEditId } = usePopup(); // Utiliser le contexte

    
    useEffect(()=>{
        const fetchItems = async () => {
            const result = await fetchCategorys();

            const transformed_result = result.map((item)=>{
                 return {
                    value:item.id,
                    label:item.repr
                 }
            })
            setCategorysList(transformed_result);
        
        };
        fetchItems();
          
    },[])


    const handleUpdate = async () => {
        let valid = true;

        if (!fieldName) {
            setError(prev => { return { ...prev, 'name': 'Name is required.' }; }); // Set specific error message
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['name']; return newState; }); // Remove the error if valid
        }

        if (!fieldPrice) {
            setError(prev => { return { ...prev, 'price': 'Price is required.' }; }); // Set specific error message
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['price']; return newState; }); // Remove the error if valid
        }

        if (!fieldCategory) {
            setError(prev => { return { ...prev, 'category': 'Category is required.' }; }); // Set specific error message
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['category']; return newState; }); // Remove the error if valid
        }

    if (!valid) return; 



        // Only proceed if valid

        const data={ name:fieldName, price:fieldPrice, category:fieldCategory, image:fieldImage }
        const formData = objectToFormData(data)

        await updateProduct(id, formData , {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the headers for file upload
            },
        })
        
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
            const result = await fetchProductsItem(itemEditId);
            setId(result.id);

            

setFieldName(result.name);

setFieldPrice(result.price);



                if(result.categoryId)
                setFieldCategory(result.categoryId);
                

setFieldImage(result.image);

             
           
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
                    <DialogTitle>Edit Product</DialogTitle>
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
                
                
                            <Label htmlFor="price" className="text-right">
                    Price
                </Label>
                
                            
                <Input
                   type="number"

                   
                   step="0.1"
                   id="price"
                   value={fieldPrice}
                   onChange={e => setFieldPrice(Number(e.target.value))} 
                   className="col-span-3"
                />                
                 
                        
                {error['price'] && <p className="text-red-600">{error['price']}</p>}  
            </div>
            


            <div className="items-center gap-4">
                
                
                            <Label htmlFor="category" className="text-right">
                    Category
                </Label>
                
                            
                <SelectCommand
                    options={categorysList}
                    value={fieldCategory}
                    onChange={setFieldCategory} 
                />
                 
                        
                {error['category'] && <p className="text-red-600">{error['category']}</p>}  
            </div>
            


            <div className="items-center gap-4">
                
                
                            <Label htmlFor="image" className="text-right">
                    Image
                </Label>
                
                            
                <Input
                   type="file"
                   accept="image/*"    
                   id="image"
              
                   onChange={e => setFieldImage(e.target.files[0])} 
                   className="col-span-3"
                />                
                 
                        
                {error['image'] && <p className="text-red-600">{error['image']}</p>}  
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

export default ProductUpdateComponent;
