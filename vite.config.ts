export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  console.log('Vite loading config. CWD:', process.cwd());
  return {
    base: './', // <-- ADD THIS LINE
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});
