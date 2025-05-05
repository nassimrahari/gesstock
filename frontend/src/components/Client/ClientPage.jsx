import React from 'react';
import  ClientList  from './ClientList';
import ClientCreateComponent  from './ClientCreateComponent';
import  ClientUpdateComponent  from './ClientUpdateComponent';
import { PopupProvider,usePopup } from './ClientPopupContext'; // Importer le contexte

import { Button } from '../ui/button';


const ClientComponent = () => {

    const {setOpenCreate} = usePopup()

    return (
    
      <div className="p-5 bg-white dark:bg-gray-800">
             <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4 dark:text-white"> Clients</h1>
                <Button onClick={() => setOpenCreate(true)} >Add  Client</Button>
             </div>
            <ClientList />
            <ClientCreateComponent />
            <ClientUpdateComponent />
        </div>
    
    );
};


const  ClientPage = () => {

    return (
     <div className="w-full p-4 dark:bg-gray-900">
    <PopupProvider>
        <ClientComponent />
    </PopupProvider>   
    </div>
    ) 
};

export default ClientPage;
