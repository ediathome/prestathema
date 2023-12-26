export default {
  root: ('./src'),
  build: {
    lib: {
      entry: ('main.js'),
      name: "PrestathemaJsLibrary",
      fileName: 'prestathemajs',
    },
    outDir: ('../../prestathema/views/js')
  },
  resolve: {
  },
  server: {
    port: 8080,
    hot: true
  }
}