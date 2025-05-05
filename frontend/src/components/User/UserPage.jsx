import React from 'react';
import  UserList  from './UserList';
import UserCreateComponent  from './UserCreateComponent';
import  UserUpdateComponent  from './UserUpdateComponent';
import { PopupProvider,usePopup } from './UserPopupContext'; // Importer le contexte

import { Button } from '../ui/button';


const UserComponent = () => {

    const {setOpenCreate} = usePopup()

    return (
    
        <div className="p-4 dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <Button onClick={() => setOpenCreate(true)} >Add User</Button>
            <UserList />
            <UserCreateComponent />
            <UserUpdateComponent />
        </div>
    
    );
};


const  UserPage = () => {

    return (
    <PopupProvider>
        <UserComponent />
    </PopupProvider>   
    ) 
};

export default UserPage;
