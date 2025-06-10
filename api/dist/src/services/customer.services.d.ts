declare const exist: (email: string) => Promise<{
    id: number;
    first_name: string;
    last_name: string;
    tel_number: string;
    email: string;
    password: string;
    log_date: Date | null;
    log_time: Date | null;
}[]>;
declare const add_customer: (first_name: string, last_name: string, tel_number: string, email: string, password: string) => Promise<{
    id: number;
    first_name: string;
    last_name: string;
    tel_number: string;
    email: string;
    password: string;
    log_date: Date | null;
    log_time: Date | null;
}>;
export { exist, add_customer, };
