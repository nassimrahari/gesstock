
    
        
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {formatDate}  = require('../services/formatDate');






class ClientController {
    async getAll(req, res) {
        try {
            const items = await prisma.client.findMany({
            

                include: {
                    },

                orderBy: {
                    id: 'desc', // This orders by id in descending order
                },
            });
            // Transformation des items avant de les renvoyer
                const transformedItems = await Promise.all(
                    items.map(async (item) => {
                    
                        
                        
                        return {
                        id: item.id,
                    name: item.name,
                    contact_email: item.contact_email,
                    phone_number: item.phone_number,
                    repr: (() => {try {return `${item?.name}`;} catch (error) {return `Object Client(${item.id})`;}})(),

                        
                        
                         };
                    
                   
                    })
                 );


         

                
    
                res.json(transformedItems);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching items' });
        }
    }
        
        async create(req, res) {
            try {
const { name, contact_email, phone_number } = req.body;









                
                let messages = {};
        
                // Check for uniqueness of the Name
                const existingName = await prisma.client.findUnique({
                    where: { name: name }
                });
            
                // Check for uniqueness of the Contact Email
                const existingContactEmail = await prisma.client.findUnique({
                    where: { contact_email: contact_email }
                });
            
                if (existingName) {
                    messages={...messages,name:'Name  must be unique'};
                }
            
                if (existingContactEmail) {
                    messages={...messages,contact_email:'Contact Email  must be unique'};
                }
            
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.client.create({
                    data: {
                        name: name,
                        contact_email: contact_email,
                        phone_number: phone_number
                    }
                });

                

        

                res.status(201).json(item);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error creating item' });
            }
        }
        

        
        async getById(req, res) {
            try {
                const item = await prisma.client.findUnique(
                    { 
                        where: { id: Number(req.params.id) },
                        include: {} 
                    
                    }
                );
                if (!item) {
                    return res.status(404).json({ message: 'Item not found' });
                }
                res.json(item);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error fetching item' });
            }
        }
        
        

        
        async update(req, res) {
            try {
            
const { name, contact_email, phone_number } = req.body;

                const clientId = Number(req.params.id);









                
                let messages = {};
        
                // Check for uniqueness of the Name
                const existingName = await prisma.client.findUnique({
                    where: {
                          name: name, 
                          NOT:{
                             id:clientId
                          }
                    },
                });
            
                // Check for uniqueness of the Contact Email
                const existingContactEmail = await prisma.client.findUnique({
                    where: {
                          contact_email: contact_email, 
                          NOT:{
                             id:clientId
                          }
                    },
                });
            
                if (existingName) {
                    messages={...messages,name:'Name  must be unique'};
                }
            
                if (existingContactEmail) {
                    messages={...messages,contact_email:'Contact Email  must be unique'};
                }
            
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.client.update({
                    where: { id: clientId },
                    data: {
                        name: name,
                        contact_email: contact_email,
                        phone_number: phone_number
                    }
                });

                
                res.json(item);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error updating item' });
            }
        }
        

        async delete(req, res) {
            try {
                await prisma.client.delete({ where: { id: Number(req.params.id) } });
                res.status(204).json({ message: 'Item Deleted' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error deleting item' });
            }
        }
}

module.exports = new ClientController();
