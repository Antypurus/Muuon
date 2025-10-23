import { build } from 'esbuild'

await build({
  entryPoints: ['src/ui/main.tsx', 'src/script.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
  },
  sourcemap: true,
  minify: false,
  target: ['esnext'],
})
console.log('✅ Build complete')