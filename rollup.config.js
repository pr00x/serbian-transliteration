import terser from '@rollup/plugin-terser';

export default [
    {
        input: 'dist/index.js',
        output: {
            file: 'dist/index.cjs',
            format: 'cjs',
            exports: "default"
        }
    },
    {
        input: 'dist/index.js',
        output: {
            file: 'dist/serbian-transliteration.umd.js',
            format: 'umd',
            name: 'SerbianTransliteration',
            exports: "default"
        },
        plugins: [terser()]
    },
];