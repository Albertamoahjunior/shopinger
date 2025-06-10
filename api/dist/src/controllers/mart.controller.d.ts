import { Request, Response } from 'express';
declare const _default: {
    get_mart_items: (req: Request, res: Response) => Promise<void>;
    get_mart_item_by_id: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    add_mart_item: (req: Request, res: Response) => Promise<void>;
    remove_mart_item: (req: Request, res: Response) => Promise<void>;
    update_mart_item: (req: Request, res: Response) => Promise<void>;
};
export default _default;
