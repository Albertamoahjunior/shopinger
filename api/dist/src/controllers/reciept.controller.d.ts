import { Request, Response } from 'express';
declare const _default: {
    get_reciepts: (req: Request, res: Response) => Promise<void>;
    get_reciept_by_id: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    add_reciept: (req: Request, res: Response) => Promise<void>;
    remove_reciept: (req: Request, res: Response) => Promise<void>;
};
export default _default;
