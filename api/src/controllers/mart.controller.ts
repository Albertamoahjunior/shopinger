import { Request, Response } from "express";
import * as martService from "../services/mart.services";

const martController = {
    getCart: async (req: Request, res: Response) => {
        try {
            const customerId = parseInt(req.params.customerId);
            const cart = await martService.getCart(customerId);
            res.status(200).json(cart);
        } catch (error) {
            console.error("Error getting cart:", error);
            res.status(500).send("Internal Server Error");
        }
    },

    addItemToCart: async (req: Request, res: Response) => {
        try {
            const customerId = parseInt(req.body.customerId);
            const productId = req.body.productId;
            const qty = parseInt(req.body.qty);
            const cartItem = await martService.addItemToCart(customerId, productId, qty);
            res.status(201).json(cartItem);
        } catch (error) {
            console.error("Error adding item to cart:", error);
            res.status(500).send("Internal Server Error");
        }
    },

    updateCartItemQty: async (req: Request, res: Response) => {
        try {
            const customerId = parseInt(req.body.customerId);
            const productId = req.body.productId;
            const qty = parseInt(req.body.qty);
            const cartItem = await martService.updateCartItemQty(customerId, productId, qty);
            res.status(200).json(cartItem);
        } catch (error) {
            console.error("Error updating cart item quantity:", error);
            res.status(500).send("Internal Server Error");
        }
    },

    removeItemFromCart: async (req: Request, res: Response) => {
        try {
            const customerId = parseInt(req.params.customerId);
            const productId = req.params.productId;
            const cartItem = await martService.removeItemFromCart(customerId, productId);
            res.status(200).json(cartItem);
        } catch (error) {
            console.error("Error removing item from cart:", error);
            res.status(500).send("Internal Server Error");
        }
    }
};

export default martController;
