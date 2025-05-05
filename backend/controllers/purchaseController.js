
    
        
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {formatDate}  = require('../services/formatDate');






class PurchaseController {
    async getAll(req, res) {
        try {
            const items = await prisma.purchase.findMany({
            

                include: {
                    supplier: true,
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
                    purchase_date: formatDate(item.purchase_date),
                    supplier:{
                        id: item.supplier.id,
                        name: item.supplier.name,
                        contact_email: item.supplier.contact_email,
                        phone_number: item.supplier.phone_number,
                        repr: (() => {try {return `${item.supplier?.name}`;} catch (error) {return `Object Supplier(${item.id})`;}})(),

                    },
                    repr: (() => {try {return `Purchase on ${item?.purchase_date}`;} catch (error) {return `Object Purchase(${item.id})`;}})(),

                        
                        
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
const { purchaseLines, purchase_date, supplier } = req.body;









                
                let messages = {};
        
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.purchase.create({
                    data: {
                        purchase_date: purchase_date ? new Date(purchase_date) : undefined,
                        supplierId: supplier
                    }
                });

                

        
                    
                    
                    for (let index = 0; index < purchaseLines.length; index++) {
                        const purchaseLineData = purchaseLines[index];

                        const purchaseLine = {
                           purchaseId: item.id,
                        productId: purchaseLineData.product,
                        quantity: purchaseLineData.quantity,
                        price: purchaseLineData.price
                        }

                        try{
                        const ligne= await prisma.purchaseLine.create({data:purchaseLine})
                        }catch (error) {}
                    }

                    

                    

                res.status(201).json(item);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error creating item' });
            }
        }
        

        
        async getById(req, res) {
            try {
                const item = await prisma.purchase.findUnique(
                    { 
                        where: { id: Number(req.params.id) },
                        include: {purchaseLines:true,} 
                    
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
            
const { purchaseLines, purchase_date, supplier } = req.body;

                const purchaseId = Number(req.params.id);









                
                let messages = {};
        
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.purchase.update({
                    where: { id: purchaseId },
                    data: {
                        purchase_date: purchase_date ? new Date(purchase_date) : undefined,
                        supplierId: supplier
                    }
                });

                
                    
                    


                    // Supprimer les lignes d'achat qui ne sont pas dans la nouvelle liste
                    const purchaseLinesIds = purchaseLines.map((ligne) => ligne.id).filter(Boolean);
                    
                    await prisma.purchaseLine.deleteMany({
                        where: {
                            purchaseId,
                            id: {
                                notIn: purchaseLinesIds
                            }
                        }
                    });

                     for (const purchaseLineData of purchaseLines) {
                        
                     const { id } = purchaseLineData;
                        const purchaseLine = {
                           purchaseId: item.id,
                        productId: purchaseLineData.product,
                        quantity: purchaseLineData.quantity,
                        price: purchaseLineData.price
                        }

                        try{
                        
                            if (id) {
                                // Mettre à jour la ligne d'purchase existante
                                await prisma.purchaseLine.update({
                                    where: { id },
                                    data: purchaseLine
                            });
                        } else {
                            // Créer une nouvelle ligne d'purchase
                            await prisma.purchaseLine.create({ data: purchaseLine });
                        }
                    
                        }catch (error) {}
                    }

                    

                    
                res.json(item);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error updating item' });
            }
        }
        

        async delete(req, res) {
            try {
                await prisma.purchase.delete({ where: { id: Number(req.params.id) } });
                res.status(204).json({ message: 'Item Deleted' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error deleting item' });
            }
        }
}

module.exports = new PurchaseController();
