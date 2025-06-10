import { Request, Response } from 'express';
declare const _default: {
    get_suppliers: (req: Request, res: Response) => Promise<void>;
    get_supplier_by_id: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    add_supplier: (req: Request, res: Response) => Promise<void>;
    remove_supplier: (req: Request, res: Response) => Promise<void>;
    update_supplier: (req: Request, res: Response) => Promise<void>;
};
export default _default;
