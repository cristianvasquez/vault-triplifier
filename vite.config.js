export default {
  base: './', // Ensure assets use relative paths
  resolve: {
    alias: {
      stream: "readable-stream",
    },
  },
  worker: {
    format: 'es',
  },
  define: {
    'global': {},
  },
}
