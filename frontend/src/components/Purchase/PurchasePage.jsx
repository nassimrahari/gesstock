import React from 'react';
import  PurchaseList  from './PurchaseList';
import PurchaseCreateComponent  from './PurchaseCreateComponent';
import  PurchaseUpdateComponent  from './PurchaseUpdateComponent';
import { PopupProvider,usePopup } from './PurchasePopupContext'; // Importer le contexte

import { Button } from '../ui/button';


const PurchaseComponent = () => {

    const {setOpenCreate} = usePopup()

    return (
    
      <div className="p-5 bg-white dark:bg-gray-800">
             <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4 dark:text-white"> Purchases</h1>
                <Button onClick={() => setOpenCreate(true)} >Add  Purchase</Button>
             </div>
            <PurchaseList />
            <PurchaseCreateComponent />
            <PurchaseUpdateComponent />
        </div>
    
    );
};


const  PurchasePage = () => {

    return (
     <div className="w-full p-4 dark:bg-gray-900">
    <PopupProvider>
        <PurchaseComponent />
    </PopupProvider>   
    </div>
    ) 
};

export default PurchasePage;
