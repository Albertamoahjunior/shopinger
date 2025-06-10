import { Request, Response } from 'express';
declare const _default: {
    get_sales: (req: Request, res: Response) => Promise<void>;
    get_sale_by_id: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    add_sale: (req: Request, res: Response) => Promise<void>;
    remove_sale: (req: Request, res: Response) => Promise<void>;
    update_sale: (req: Request, res: Response) => Promise<void>;
};
export default _default;
