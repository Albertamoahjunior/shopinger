import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCart = async (customerId: number) => {
    try {
        const cart = await prisma.mart.findMany({
            where: {
                customer_id: customerId,
            },
            include: {
                product: true,
            },
        });
        return cart;
    } catch (error) {
        console.error("Error getting cart:", error);
        throw error;
    }
};

export const addItemToCart = async (customerId: number, productId: string, qty: number) => {
    try {
        const cartItem = await prisma.mart.create({
            data: {
                customer_id: customerId,
                product_id: productId,
                qty: qty,
                type: 'cart',
            },
        });
        return cartItem;
    } catch (error) {
        console.error("Error adding item to cart:", error);
        throw error;
    }
};

export const updateCartItemQty = async (customerId: number, productId: string, qty: number) => {
    try {
        const cartItem = await prisma.mart.update({
            where: {
                customer_id_product_id_type: {
                    customer_id: customerId,
                    product_id: productId,
                    type: 'cart',
                },
            },
            data: {
                qty: qty,
            },
        });
        return cartItem;
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        throw error;
    }
};

export const removeItemFromCart = async (customerId: number, productId: string) => {
    try {
        const cartItem = await prisma.mart.delete({
            where: {
                customer_id_product_id_type: {
                    customer_id: customerId,
                    product_id: productId,
                    type: 'cart',
                },
            },
        });
        return cartItem;
    } catch (error) {
        console.error("Error removing item from cart:", error);
        throw error;
    }
};
