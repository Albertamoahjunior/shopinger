import { Request, Response } from 'express';
declare const _default: {
    get_inventory: (req: Request, res: Response) => Promise<void>;
    get_inventory_by_id: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    add_inventory: (req: Request, res: Response) => Promise<void>;
    remove_inventory: (req: Request, res: Response) => Promise<void>;
    update_inventory: (req: Request, res: Response) => Promise<void>;
    add_inventory_image: (req: Request, res: Response) => Promise<void>;
    search_product: (req: Request, res: Response) => Promise<void>;
};
export default _default;
