import React, { useState,useEffect } from 'react';
import { updatePurchaseLine, fetchPurchaseLinesItem } from '../../services/purchaselineService';


import { fetchPurchases } from '../../services/purchaseService';

import { fetchProducts } from '../../services/productService';



import { usePopup } from './PurchaseLinePopupContext'; // Importer le context
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"



import SelectCommand from '../SelectCommand';

const PurchaseLineUpdateComponent = () => {
    const [id, setId] = useState('');
    const [fieldPurchase, setFieldPurchase] = useState('');
const [fieldProduct, setFieldProduct] = useState('');
const [fieldQuantity, setFieldQuantity] = useState('');
const [fieldPrice, setFieldPrice] = useState('');
    const [error, setError] = useState({});  // Add error handling state


    
    
    

    
    const [purchasesList, setPurchasesList] = useState([]);

    const [productsList, setProductsList] = useState([]);


    const { openUpdate, setOpenUpdate, triggerRefresh,itemEditId } = usePopup(); // Utiliser le contexte

    
    useEffect(()=>{
        const fetchItems = async () => {
            const result = await fetchPurchases();

            const transformed_result = result.map((item)=>{
                 return {
                    value:item.id,
                    label:item.repr
                 }
            })
            setPurchasesList(transformed_result);
        
        };
        fetchItems();
          
    },[])

    useEffect(()=>{
        const fetchItems = async () => {
            const result = await fetchProducts();

            const transformed_result = result.map((item)=>{
                 return {
                    value:item.id,
                    label:item.repr
                 }
            })
            setProductsList(transformed_result);
        
        };
        fetchItems();
          
    },[])


    const handleUpdate = async () => {
        let valid = true;

        if (!fieldPurchase) {
            setError(prev => { return { ...prev, 'purchase': 'Purchase is required.' }; }); // Set specific error message
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['purchase']; return newState; }); // Remove the error if valid
        }

        if (!fieldProduct) {
            setError(prev => { return { ...prev, 'product': 'Product is required.' }; }); // Set specific error message
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['product']; return newState; }); // Remove the error if valid
        }

        if (!fieldQuantity) {
            setError(prev => { return { ...prev, 'quantity': 'Quantity is required.' }; }); // Set specific error message
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['quantity']; return newState; }); // Remove the error if valid
        }

        if (!fieldPrice) {
            setError(prev => { return { ...prev, 'price': 'Price is required.' }; }); // Set specific error message
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['price']; return newState; }); // Remove the error if valid
        }

    if (!valid) return; 



        // Only proceed if valid

        const data={ purchase:fieldPurchase, product:fieldProduct, quantity:fieldQuantity, price:fieldPrice }
        

        await updatePurchaseLine(id, data)
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
            const result = await fetchPurchaseLinesItem(itemEditId);
            setId(result.id);

            



                if(result.purchaseId)
                setFieldPurchase(result.purchaseId);
                



                if(result.productId)
                setFieldProduct(result.productId);
                

setFieldQuantity(result.quantity);

setFieldPrice(result.price);

             
           
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
                    <DialogTitle>Edit PurchaseLine</DialogTitle>
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
                
                
                            <Label htmlFor="purchase" className="text-right">
                    Purchase
                </Label>
                
                            
                <SelectCommand
                    options={purchasesList}
                    value={fieldPurchase}
                    onChange={setFieldPurchase} 
                />
                 
                        
                {error['purchase'] && <p className="text-red-600">{error['purchase']}</p>}  
            </div>
            


            <div className="items-center gap-4">
                
                
                            <Label htmlFor="product" className="text-right">
                    Product
                </Label>
                
                            
                <SelectCommand
                    options={productsList}
                    value={fieldProduct}
                    onChange={setFieldProduct} 
                />
                 
                        
                {error['product'] && <p className="text-red-600">{error['product']}</p>}  
            </div>
            


            <div className="items-center gap-4">
                
                
                            <Label htmlFor="quantity" className="text-right">
                    Quantity
                </Label>
                
                            
                <Input
                   type="number"

                   min="0"
                   step="1"
                   id="quantity"
                   value={fieldQuantity}
                   onChange={e => setFieldQuantity(Number(e.target.value))} 
                   className="col-span-3"
                />                
                 
                        
                {error['quantity'] && <p className="text-red-600">{error['quantity']}</p>}  
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

export default PurchaseLineUpdateComponent;
