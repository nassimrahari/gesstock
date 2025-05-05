import React from 'react';
import  SaleList  from './SaleList';
import SaleCreateComponent  from './SaleCreateComponent';
import  SaleUpdateComponent  from './SaleUpdateComponent';
import { PopupProvider,usePopup } from './SalePopupContext'; // Importer le contexte

import { Button } from '../ui/button';


const SaleComponent = () => {

    const {setOpenCreate} = usePopup()

    return (
    
      <div className="p-5 bg-white dark:bg-gray-800">
             <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4 dark:text-white"> Sales</h1>
                <Button onClick={() => setOpenCreate(true)} >Add  Sale</Button>
             </div>
            <SaleList />
            <SaleCreateComponent />
            <SaleUpdateComponent />
        </div>
    
    );
};


const  SalePage = () => {

    return (
     <div className="w-full p-4 dark:bg-gray-900">
    <PopupProvider>
        <SaleComponent />
    </PopupProvider>   
    </div>
    ) 
};

export default SalePage;
