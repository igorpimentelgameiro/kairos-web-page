const BASE_API_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api").replace(/\/$/, "");
const DEFAULT_MOVIMENTO_USUARIO = import.meta.env.VITE_API_MOVIMENTO_USUARIO ?? "admin";
const MOVIMENTO_HEADER_NAME = "x-movimento-kairos-usuario";

export class ApiError extends Error {
    readonly status: number;
    readonly details?: unknown;

    constructor(status: number, message: string, details?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

const resolveUrl = (path: string): string => {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }
    const sanitizedPath = path.replace(/^\//, "");
    return `${BASE_API_URL}/${sanitizedPath}`;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType) {
        return undefined;
    }
    if (contentType.includes("application/json")) {
        return response.json().catch(() => undefined);
    }
    return response.text();
};

export async function fetcher<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers ?? {});

    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }
    if (!headers.has(MOVIMENTO_HEADER_NAME)) {
        headers.set(MOVIMENTO_HEADER_NAME, DEFAULT_MOVIMENTO_USUARIO);
    }

    if (init.body != null && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(resolveUrl(path), {
        ...init,
        headers,
    });

    if (!response.ok) {
        const errorBody = await parseResponseBody(response);
        const message =
            typeof errorBody === "object" && errorBody !== null && "message" in errorBody
                ? String((errorBody as { message?: unknown }).message)
                : response.statusText || "Erro ao comunicar com o servidor";

        throw new ApiError(response.status, message, errorBody);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const result = await parseResponseBody(response);

    return result as T;
}
