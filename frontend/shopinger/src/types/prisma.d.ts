// This file contains Prisma-related types for the frontend.
// These types are manually defined to avoid importing @prisma/client directly in the frontend.

export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export interface Address {
    id: number;
    profile_id: number;
    address_line?: string | null;
    country?: string | null;
    state?: string | null;
    city?: string | null;
    postal_code?: string | null;
    is_primary: boolean;
}
