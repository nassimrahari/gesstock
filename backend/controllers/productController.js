
    
        
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {formatDate}  = require('../services/formatDate');






// Function to  QuantityEntry of  Product
async function calculateProductQuantityEntry(id) {
    const purchaseLines = await prisma.purchaseLine.findMany({
        where: { productId:id },
        select: { quantity: true },
    });


    const total = purchaseLines.reduce((sum, purchaseLine) => sum + Number(purchaseLine.quantity), 0);

    return total
}
                
// Function to  QuantitySortie of  Product
async function calculateProductQuantitySortie(id) {
    const saleLines = await prisma.saleLine.findMany({
        where: { productId:id },
        select: { quantity: true },
    });


    const total = saleLines.reduce((sum, saleLine) => sum + Number(saleLine.quantity), 0);

    return total
}
                
class ProductController {
    async getAll(req, res) {
        try {
            const items = await prisma.product.findMany({
            

                include: {
                    category: true,
                    },

                orderBy: {
                    id: 'desc', // This orders by id in descending order
                },
            });
            // Transformation des items avant de les renvoyer
                const transformedItems = await Promise.all(
                    items.map(async (item) => {
                    
                        
                const quantity_entry = await calculateProductQuantityEntry(item.id)
                
                const quantity_sortie = await calculateProductQuantitySortie(item.id)
                
                        
                    const quantity = quantity_entry - quantity_sortie
                
                        return {
                        id: item.id,
                    name: item.name,
                    price: item.price,
                    category:{
                        id: item.category.id,
                        name: item.category.name,
                        description: item.category.description,
                        repr: (() => {try {return `${item.category?.name}`;} catch (error) {return `Object Category(${item.id})`;}})(),

                    },
                    image: item.image,
                    repr: (() => {try {return `${item?.name}`;} catch (error) {return `Object Product(${item.id})`;}})(),

                        
                    quantity_entry:quantity_entry,
                
                    quantity_sortie:quantity_sortie,
                
                        
                    quantity:quantity,
                
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
let { name, price, category } = req.body;




            // Récupérer les chemins des fichiers téléchargés par Multer
            const image = req.files.image ? `/uploads/${req.files.image[0].filename}` : null;


price= Number(price)
category= Number(category)




                
                let messages = {};
        
                if (price < 0 || price > 100000000) {
                    messages = {...messages, price: 'Price must be between 0 and 100000000'};
                }
                
                // Check for uniqueness of the Name
                const existingName = await prisma.product.findUnique({
                    where: { name: name }
                });
            
                if (existingName) {
                    messages={...messages,name:'Name  must be unique'};
                }
            
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.product.create({
                    data: {
                        name: name,
                        price: price,
                        categoryId: category,
                        image: image
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
                const item = await prisma.product.findUnique(
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
            
let { name, price, category } = req.body;

                const productId = Number(req.params.id);






            // Récupérer les chemins des fichiers téléchargés par Multer
            const image = req.files.image ? `/uploads/${req.files.image[0].filename}` : null;


price= Number(price)
category= Number(category)


                
                let messages = {};
        
                if (price < 0 || price > 100000000) {
                    messages = {...messages, price: 'Price must be between 0 and 100000000'};
                }
                
                // Check for uniqueness of the Name
                const existingName = await prisma.product.findUnique({
                    where: {
                          name: name, 
                          NOT:{
                             id:productId
                          }
                    },
                });
            
                if (existingName) {
                    messages={...messages,name:'Name  must be unique'};
                }
            
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.product.update({
                    where: { id: productId },
                    data: {
                        name: name,
                        price: price,
                        categoryId: category,
                        ...(image != null && {image})
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
                await prisma.product.delete({ where: { id: Number(req.params.id) } });
                res.status(204).json({ message: 'Item Deleted' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error deleting item' });
            }
        }
}

module.exports = new ProductController();
