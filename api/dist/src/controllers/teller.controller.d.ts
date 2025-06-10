import { Request, Response } from 'express';
declare const _default: {
    get_tellers: (req: Request, res: Response) => Promise<void>;
    get_teller_by_id: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    add_teller: (req: Request, res: Response) => Promise<void>;
    remove_teller: (req: Request, res: Response) => Promise<void>;
    update_teller: (req: Request, res: Response) => Promise<void>;
};
export default _default;
