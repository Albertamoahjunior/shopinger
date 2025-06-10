import { Request, Response } from 'express';
declare const _default: {
    get_deliverers: (req: Request, res: Response) => Promise<void>;
    get_deliverer_by_id: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    add_deliverer: (req: Request, res: Response) => Promise<void>;
    remove_deliverer: (req: Request, res: Response) => Promise<void>;
    update_deliverer: (req: Request, res: Response) => Promise<void>;
};
export default _default;
