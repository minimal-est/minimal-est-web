export interface ErrorResponse {
    status: number;
    title: string;
    detail: string;
    properties: Record<string, any> | null;
}