import React from 'react';
import  ProductList  from './ProductList';
import ProductCreateComponent  from './ProductCreateComponent';
import  ProductUpdateComponent  from './ProductUpdateComponent';
import { PopupProvider,usePopup } from './ProductPopupContext'; // Importer le contexte

import { Button } from '../ui/button';


const ProductComponent = () => {

    const {setOpenCreate} = usePopup()

    return (
    
      <div className="p-5 bg-white dark:bg-gray-800">
             <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4 dark:text-white"> Products</h1>
                <Button onClick={() => setOpenCreate(true)} >Add  Product</Button>
             </div>
            <ProductList />
            <ProductCreateComponent />
            <ProductUpdateComponent />
        </div>
    
    );
};


const  ProductPage = () => {

    return (
     <div className="w-full p-4 dark:bg-gray-900">
    <PopupProvider>
        <ProductComponent />
    </PopupProvider>   
    </div>
    ) 
};

export default ProductPage;
