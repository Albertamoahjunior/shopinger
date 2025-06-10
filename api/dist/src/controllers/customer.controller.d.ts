import { Request, Response } from 'express';
declare const _default: {
    get_customers: (req: Request, res: Response) => Promise<void>;
    get_customer_by_id: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    add_customer: (req: Request, res: Response) => Promise<void>;
    remove_customer: (req: Request, res: Response) => Promise<void>;
    update_customer: (req: Request, res: Response) => Promise<void>;
};
export default _default;
