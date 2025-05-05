import React from 'react';
import  SaleLineList  from './SaleLineList';
import SaleLineCreateComponent  from './SaleLineCreateComponent';
import  SaleLineUpdateComponent  from './SaleLineUpdateComponent';
import { PopupProvider,usePopup } from './SaleLinePopupContext'; // Importer le contexte

import { Button } from '../ui/button';


const SaleLineComponent = () => {

    const {setOpenCreate} = usePopup()

    return (
    
      <div className="p-5 bg-white dark:bg-gray-800">
             <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4 dark:text-white"> Sale Lines</h1>
                <Button onClick={() => setOpenCreate(true)} >Add  Sale Line</Button>
             </div>
            <SaleLineList />
            <SaleLineCreateComponent />
            <SaleLineUpdateComponent />
        </div>
    
    );
};


const  SaleLinePage = () => {

    return (
     <div className="w-full p-4 dark:bg-gray-900">
    <PopupProvider>
        <SaleLineComponent />
    </PopupProvider>   
    </div>
    ) 
};

export default SaleLinePage;
