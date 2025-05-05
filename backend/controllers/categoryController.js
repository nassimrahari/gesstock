
    
        
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {formatDate}  = require('../services/formatDate');






class CategoryController {
    async getAll(req, res) {
        try {
            const items = await prisma.category.findMany({
            

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
                    description: item.description,
                    repr: (() => {try {return `${item?.name}`;} catch (error) {return `Object Category(${item.id})`;}})(),

                        
                        
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
const { name, description } = req.body;









                
                let messages = {};
        
                // Check for uniqueness of the Name
                const existingName = await prisma.category.findUnique({
                    where: { name: name }
                });
            
                if (existingName) {
                    messages={...messages,name:'Name  must be unique'};
                }
            
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.category.create({
                    data: {
                        name: name,
                        description: description
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
                const item = await prisma.category.findUnique(
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
            
const { name, description } = req.body;

                const categoryId = Number(req.params.id);









                
                let messages = {};
        
                // Check for uniqueness of the Name
                const existingName = await prisma.category.findUnique({
                    where: {
                          name: name, 
                          NOT:{
                             id:categoryId
                          }
                    },
                });
            
                if (existingName) {
                    messages={...messages,name:'Name  must be unique'};
                }
            
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.category.update({
                    where: { id: categoryId },
                    data: {
                        name: name,
                        description: description
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
                await prisma.category.delete({ where: { id: Number(req.params.id) } });
                res.status(204).json({ message: 'Item Deleted' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error deleting item' });
            }
        }
}

module.exports = new CategoryController();
