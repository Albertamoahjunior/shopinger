import { Request, Response } from "express";
declare const _default: {
    login: (req: Request, res: Response) => void;
    sign_up_customer: (req: Request, res: Response) => Promise<void>;
    log_out: (req: Request, res: Response) => void;
};
export default _default;
