import React from 'react';
import  PurchaseLineList  from './PurchaseLineList';
import PurchaseLineCreateComponent  from './PurchaseLineCreateComponent';
import  PurchaseLineUpdateComponent  from './PurchaseLineUpdateComponent';
import { PopupProvider,usePopup } from './PurchaseLinePopupContext'; // Importer le contexte

import { Button } from '../ui/button';


const PurchaseLineComponent = () => {

    const {setOpenCreate} = usePopup()

    return (
    
      <div className="p-5 bg-white dark:bg-gray-800">
             <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4 dark:text-white"> Purchase Lines</h1>
                <Button onClick={() => setOpenCreate(true)} >Add  Purchase Line</Button>
             </div>
            <PurchaseLineList />
            <PurchaseLineCreateComponent />
            <PurchaseLineUpdateComponent />
        </div>
    
    );
};


const  PurchaseLinePage = () => {

    return (
     <div className="w-full p-4 dark:bg-gray-900">
    <PopupProvider>
        <PurchaseLineComponent />
    </PopupProvider>   
    </div>
    ) 
};

export default PurchaseLinePage;
