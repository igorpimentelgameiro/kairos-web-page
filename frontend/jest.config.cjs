module.exports = {
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src"],
    setupFilesAfterEnv: ["<rootDir>/src/test/jest.setup.ts"],
    moduleNameMapper: {
        "^@app/(.*)$": "<rootDir>/src/app/$1",
        "^@componente/(.*)$": "<rootDir>/src/componente/$1",
        "^@dominio/(.*)$": "<rootDir>/src/dominio/$1",
        "^@pagina/(.*)$": "<rootDir>/src/pagina/$1",
        "^@assets/(.*)$": "<rootDir>/src/assets/$1",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: "<rootDir>/tsconfig.test.json",
            },
        ],
    },
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.test.{ts,tsx}",
        "!src/test/**",
        "!src/app/main.tsx",
    ],
    coverageDirectory: "<rootDir>/coverage",
    coverageReporters: ["text", "lcov", "html"],
};
