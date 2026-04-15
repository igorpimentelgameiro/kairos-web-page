const baseEnv = {
    VITE_FIREBASE_API_KEY: "api-key",
    VITE_FIREBASE_AUTH_DOMAIN: "kairos.firebaseapp.com",
    VITE_FIREBASE_DATABASE_URL: "https://kairos.firebaseio.com",
    VITE_FIREBASE_PROJECT_ID: "kairos",
    VITE_FIREBASE_STORAGE_BUCKET: "gs://kairos.firebasestorage.app/",
    VITE_FIREBASE_MESSAGING_SENDER_ID: "sender",
    VITE_FIREBASE_APP_ID: "app-id",
    VITE_FIREBASE_MEASUREMENT_ID: "measure-id",
};

const getAppMock = jest.fn();
const getAppsMock = jest.fn();
const initializeAppMock = jest.fn();
const getDatabaseMock = jest.fn();
const getAuthMock = jest.fn();
const getStorageMock = jest.fn();

jest.mock("firebase/app", () => ({
    getApp: (...args: unknown[]) => getAppMock(...args),
    getApps: (...args: unknown[]) => getAppsMock(...args),
    initializeApp: (...args: unknown[]) => initializeAppMock(...args),
}));

jest.mock("firebase/database", () => ({
    getDatabase: (...args: unknown[]) => getDatabaseMock(...args),
}));

jest.mock("firebase/auth", () => ({
    getAuth: (...args: unknown[]) => getAuthMock(...args),
}));

jest.mock("firebase/storage", () => ({
    getStorage: (...args: unknown[]) => getStorageMock(...args),
}));

describe("firebase app", () => {
    beforeEach(() => {
        jest.resetModules();
        getAppMock.mockReset();
        getAppsMock.mockReset();
        initializeAppMock.mockReset();
        getDatabaseMock.mockReset();
        getAuthMock.mockReset();
        getStorageMock.mockReset();
        (globalThis as typeof globalThis & {__VITE_ENV__?: Record<string, string>}).__VITE_ENV__ = {
            ...baseEnv,
        };
    });

    afterEach(() => {
        delete (globalThis as typeof globalThis & {__VITE_ENV__?: Record<string, string>}).__VITE_ENV__;
    });

    test("deve inicializar o firebase quando não houver app ativo", async () => {
        getAppsMock.mockReturnValue([]);
        initializeAppMock.mockReturnValue({kind: "firebase-app"});
        getDatabaseMock.mockReturnValue({kind: "db"});
        getAuthMock.mockReturnValue({kind: "auth"});
        getStorageMock.mockReturnValue({kind: "storage"});

        const modulo = await import("./app");

        expect(initializeAppMock).toHaveBeenCalledWith(
            expect.objectContaining({
                storageBucket: "kairos.appspot.com",
                measurementId: "measure-id",
            }),
        );
        expect(modulo.firebaseApp).toEqual({kind: "firebase-app"});
        expect(modulo.firebaseDatabase).toEqual({kind: "db"});
        expect(modulo.firebaseAuth).toEqual({kind: "auth"});
        expect(modulo.firebaseStorage).toEqual({kind: "storage"});
    });

    test("deve reutilizar app já existente", async () => {
        getAppsMock.mockReturnValue([{}]);
        getAppMock.mockReturnValue({kind: "existing-app"});
        getDatabaseMock.mockReturnValue({kind: "db"});
        getAuthMock.mockReturnValue({kind: "auth"});
        getStorageMock.mockReturnValue({kind: "storage"});

        const modulo = await import("./app");

        expect(getAppMock).toHaveBeenCalled();
        expect(initializeAppMock).not.toHaveBeenCalled();
        expect(modulo.firebaseApp).toEqual({kind: "existing-app"});
    });

    test("deve falhar quando faltar variável obrigatória", async () => {
        delete (globalThis as typeof globalThis & {__VITE_ENV__?: Record<string, string>}).__VITE_ENV__!
            .VITE_FIREBASE_API_KEY;

        await expect(import("./app")).rejects.toThrow(
            "Firebase configuração ausente: defina VITE_FIREBASE_API_KEY no seu arquivo .env",
        );
    });
});
