
    
        
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {formatDate}  = require('../services/formatDate');






class SaleController {
    async getAll(req, res) {
        try {
            const items = await prisma.sale.findMany({
            

                include: {
                    client: true,
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
                    sale_date: formatDate(item.sale_date),
                    client:{
                        id: item.client.id,
                        name: item.client.name,
                        contact_email: item.client.contact_email,
                        phone_number: item.client.phone_number,
                        repr: (() => {try {return `${item.client?.name}`;} catch (error) {return `Object Client(${item.id})`;}})(),

                    },
                    repr: (() => {try {return `Sale on ${item?.sale_date}`;} catch (error) {return `Object Sale(${item.id})`;}})(),

                        
                        
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
const { saleLines, sale_date, client } = req.body;









                
                let messages = {};
        
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.sale.create({
                    data: {
                        sale_date: sale_date ? new Date(sale_date) : undefined,
                        clientId: client
                    }
                });

                

        
                    
                    
                    for (let index = 0; index < saleLines.length; index++) {
                        const saleLineData = saleLines[index];

                        const saleLine = {
                           saleId: item.id,
                        productId: saleLineData.product,
                        quantity: saleLineData.quantity,
                        price: saleLineData.price
                        }

                        try{
                        const ligne= await prisma.saleLine.create({data:saleLine})
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
                const item = await prisma.sale.findUnique(
                    { 
                        where: { id: Number(req.params.id) },
                        include: {saleLines:true,} 
                    
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
            
const { saleLines, sale_date, client } = req.body;

                const saleId = Number(req.params.id);









                
                let messages = {};
        
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.sale.update({
                    where: { id: saleId },
                    data: {
                        sale_date: sale_date ? new Date(sale_date) : undefined,
                        clientId: client
                    }
                });

                
                    
                    


                    // Supprimer les lignes d'achat qui ne sont pas dans la nouvelle liste
                    const saleLinesIds = saleLines.map((ligne) => ligne.id).filter(Boolean);
                    
                    await prisma.saleLine.deleteMany({
                        where: {
                            saleId,
                            id: {
                                notIn: saleLinesIds
                            }
                        }
                    });

                     for (const saleLineData of saleLines) {
                        
                     const { id } = saleLineData;
                        const saleLine = {
                           saleId: item.id,
                        productId: saleLineData.product,
                        quantity: saleLineData.quantity,
                        price: saleLineData.price
                        }

                        try{
                        
                            if (id) {
                                // Mettre à jour la ligne d'sale existante
                                await prisma.saleLine.update({
                                    where: { id },
                                    data: saleLine
                            });
                        } else {
                            // Créer une nouvelle ligne d'sale
                            await prisma.saleLine.create({ data: saleLine });
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
                await prisma.sale.delete({ where: { id: Number(req.params.id) } });
                res.status(204).json({ message: 'Item Deleted' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error deleting item' });
            }
        }
}

module.exports = new SaleController();
