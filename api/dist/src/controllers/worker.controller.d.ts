import { Request, Response } from 'express';
declare const _default: {
    get_workers: (req: Request, res: Response) => Promise<void>;
    get_worker_by_id: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    add_worker: (req: Request, res: Response) => Promise<void>;
    remove_worker: (req: Request, res: Response) => Promise<void>;
    update_worker: (req: Request, res: Response) => Promise<void>;
};
export default _default;
