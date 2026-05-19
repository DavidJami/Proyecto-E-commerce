const js = require('@eslint/js');

// =====================================================
// CONFIGURACIÓN DE ESLINT
// =====================================================
module.exports = [
    // =================================================
    // IGNORAR CARPETAS
    // =================================================
    {
        ignores: [
            // Carpeta generada por coverage de Jest
            'coverage/**',
            // Dependencias de Node
            'node_modules/**',
        ],
    },
    // =================================================
    // CONFIGURACIÓN GENERAL PARA TODO EL BACKEND
    // =================================================
    {
        // Aplicar a todos los archivos JS
        files: ['**/*.js'],

        // =================================================
        // CONFIGURACIÓN DEL LENGUAJE
        // =================================================
        languageOptions: {

            // Versión de JavaScript
            ecmaVersion: 2021,
            // Tipo de módulos
            sourceType: 'commonjs',
            // Variables globales permitidas
            globals: {
                console: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                Buffer: 'readonly',
            },
        },

        // =================================================
        // REGLAS PERSONALIZADAS
        // =================================================
        rules: {

            // Reglas recomendadas de ESLint
            ...js.configs.recommended.rules,

            // -------------------------------------------------
            // Permite console.log sin advertencias
            // -------------------------------------------------
            'no-console': 'off',
            // -------------------------------------------------
            // Obliga usar camelCase
            // -------------------------------------------------
            camelcase: [
                'error',
                {
                    properties: 'always',
                },
            ],

            // -------------------------------------------------
            // Variables no utilizadas
            // -------------------------------------------------
            'no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],

            // -------------------------------------------------
            // Obliga usar comillas simples
            // -------------------------------------------------
            quotes: [
                'error',
                'single',
            ],

            // -------------------------------------------------
            // Obliga usar ;
            // -------------------------------------------------
            semi: [
                'error',
                'always',
            ],

            // -------------------------------------------------
            // Obliga usar === y !==
            // -------------------------------------------------
            eqeqeq: [
                'error',
                'always',
            ],

            // -------------------------------------------------
            // No permite usar var
            // -------------------------------------------------
            'no-var': 'error',
            // -------------------------------------------------
            // Recomienda usar const
            // -------------------------------------------------
            'prefer-const': 'warn',
            // -------------------------------------------------
            // Evita espacios al final
            // -------------------------------------------------
            'no-trailing-spaces': 'error',
            // -------------------------------------------------
            // Evita múltiples líneas vacías
            // -------------------------------------------------
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1,
                },
            ],

            // -------------------------------------------------
            // Indentación de 4 espacios
            // -------------------------------------------------
            indent: [
                'error',
                4,
            ],

            // -------------------------------------------------
            // Espacio antes de {
            // -------------------------------------------------
            'space-before-blocks': [
                'error',
                'always',
            ],
            // -------------------------------------------------
            // Espacios en palabras clave
            // -------------------------------------------------
            'keyword-spacing': [
                'error',
                {
                    before: true,
                    after: true,
                },
            ],

            // -------------------------------------------------
            // Espacios después de comas
            // -------------------------------------------------
            'comma-spacing': [
                'error',
                {
                    before: false,
                    after: true,
                },
            ],

            // -------------------------------------------------
            // Evita código inalcanzable
            // -------------------------------------------------
            'no-unreachable': 'error',
            // -------------------------------------------------
            // Evita claves duplicadas
            // -------------------------------------------------
            'no-dupe-keys': 'error',
        },
    },

    // =================================================
    // CONFIGURACIÓN ESPECIAL PARA TESTS DE JEST
    // =================================================
    {
        files: ['test/**/*.js'],

        languageOptions: {

            // Variables globales de Jest
            globals: {
                afterAll: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                beforeEach: 'readonly',
                describe: 'readonly',
                expect: 'readonly',
                it: 'readonly',
                jest: 'readonly',
                test: 'readonly',
            },
        },
    },
];