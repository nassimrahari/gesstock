import React from 'react';
import  SupplierList  from './SupplierList';
import SupplierCreateComponent  from './SupplierCreateComponent';
import  SupplierUpdateComponent  from './SupplierUpdateComponent';
import { PopupProvider,usePopup } from './SupplierPopupContext'; // Importer le contexte

import { Button } from '../ui/button';


const SupplierComponent = () => {

    const {setOpenCreate} = usePopup()

    return (
    
      <div className="p-5 bg-white dark:bg-gray-800">
             <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4 dark:text-white"> Suppliers</h1>
                <Button onClick={() => setOpenCreate(true)} >Add  Supplier</Button>
             </div>
            <SupplierList />
            <SupplierCreateComponent />
            <SupplierUpdateComponent />
        </div>
    
    );
};


const  SupplierPage = () => {

    return (
     <div className="w-full p-4 dark:bg-gray-900">
    <PopupProvider>
        <SupplierComponent />
    </PopupProvider>   
    </div>
    ) 
};

export default SupplierPage;
