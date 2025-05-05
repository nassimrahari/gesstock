
    
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserController {
    async getAll(req, res) {
        try {
            const items = await prisma.user.findMany({
                include: {
                        
                },
            });
            // Transformation des items avant de les renvoyer
                const transformedItems = items.map(item => ({
                    id: item.id,
                    username: item.username,
                    email: item.email,
                    password: item.password,
                    repr: `${item.username}`,

                }));
    
                res.json(transformedItems);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching items' });
        }
    }

        async create(req, res) {
            try {
                const { username, email, password } = req.body;

                const item = await prisma.user.create({
                    data: {
                        username: username,
                        email: email,
                        password: password
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
                const item = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
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
                const { username, email, password } = req.body;

                const item = await prisma.user.update({
                    where: { id: Number(req.params.id) },
                    data: {
                        username: username,
                        email: email,
                        password: password
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
                await prisma.user.delete({ where: { id: Number(req.params.id) } });
                res.status(204).json({ message: 'Item Deleted' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error deleting item' });
            }
        }
}

module.exports = new UserController();
        