import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const get_inventory = async (req: Request, res: Response) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        supplier: true,
        images: true,
      },
    });

    const formattedInventory = inventory.map((item) => ({
      ...item,
      product_price: parseFloat(item.product_price.toString()),
      supplierName: item.supplier.supplier_name,
      imageUrls: item.images.map((image) => image.image),
    }));

    res.status(200).json(formattedInventory);
  } catch (error: any) {
    console.error("Error getting inventory:", error);
    res.status(500).send("Internal Server Error");
  }
};

const get_inventory_by_id = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;
    const inventory = await prisma.inventory.findUnique({
      where: {
        product_id: product_id,
      },
      include: {
        supplier: true,
        images: true,
      },
    });
    if (!inventory) {
      return res.status(404).send("Inventory not found");
    }

    const formattedInventory = {
      ...inventory,
      product_price: parseFloat(inventory.product_price.toString()),
      supplierName: inventory.supplier.supplier_name,
      imageUrls: inventory.images.map((image) => image.image),
    };

    res.status(200).json(formattedInventory);
  } catch (error: any) {
    console.error("Error getting inventory by id:", error);
    res.status(500).send("Internal Server Error");
  }
};

const add_inventory = async (req: Request, res: Response) => {
  try {
    const { product_id, product_name, product_qty, supplier_id, prod_desc, prod_spec, product_price } = req.body;
    const inventory = await prisma.inventory.create({
      data: {
        product_id: product_id,
        product_name: product_name,
        product_qty: product_qty,
        supplier_id: supplier_id,
        prod_desc: prod_desc,
        prod_spec: prod_spec,
        product_price: product_price,
      },
    });
    res.status(201).json(inventory);
  } catch (error: any) {
    console.error("Error adding inventory:", error);
    res.status(500).send("Internal Server Error");
  }
};

const remove_inventory = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;
    await prisma.inventory.delete({
      where: {
        product_id: product_id,
      },
    });
    res.status(204).send("Inventory deleted");
  } catch (error: any) {
    console.error("Error removing inventory:", error);
    res.status(500).send("Internal Server Error");
  }
};

const update_inventory = async (req: Request, res: Response) => {
  try {
    const { product_name, product_id } = req.body;
    const inventory = await prisma.inventory.update({
      where: {
        product_id: product_id,
      },
      data: {
        product_name: product_name,
      },
    });
    res.status(200).json(inventory);
  } catch (error: any) {
    console.error("Error updating inventory:", error);
    res.status(500).send("Internal Server Error");
  }
};

const add_inventory_image = async (req: Request, res: Response) => {
    try {
      const { product_id, image } = req.body;
      const inventoryImage = await prisma.images.create({
        data: {
          product_id: product_id,
          image: image,
        },
      });
      res.status(201).json(inventoryImage);
    } catch (error: any) {
      console.error("Error adding inventory image:", error);
      res.status(500).send("Internal Server Error");
    }
  };

const search_product = async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const inventory = await prisma.inventory.findMany({
      where: {
        OR: [
          {
            product_name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            prod_desc: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        supplier: true,
        images: true,
      },
    });

    const formattedInventory = inventory.map((item) => ({
      ...item,
      product_price: parseFloat(item.product_price.toString()),
      supplierName: item.supplier.supplier_name,
      imageUrls: item.images.map((image) => image.image),
    }));

    res.status(200).json(formattedInventory);
  } catch (error: any) {
    console.error("Error searching product:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default {
    get_inventory,
    get_inventory_by_id,
    add_inventory,
    remove_inventory,
    update_inventory,
    add_inventory_image,
    search_product,
};
