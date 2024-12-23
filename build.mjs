import dts from 'bun-plugin-dts'
import path from 'node:path'
import { readdir, rename } from 'node:fs/promises'

const output = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  external: ['bun:ffi'],
  plugins: [
    dts()
  ],
})


const XGO = path.join(process.env.HOME, 'go/bin/xgo');
const TARGETS = 'linux/arm64,linux/amd64,darwin/arm64,darwin/amd64,windows/amd64';

if (output.success) {
  console.log('Compiling native binaries...')
  const proc = Bun.spawnSync([
    XGO,
    "-go", "1.20.3",
    "-out", "release/promptx",
    `--targets=${TARGETS}`,
    "-ldflags=-s -w",
    "-buildmode=c-shared",
    ".",
  ]);
  console.log(proc.stdout.toString())
}

const binaries = await readdir('release')
const windowsBinaries = binaries.filter((binary) => binary.includes('windows'));
Promise.all(
  windowsBinaries.map((binary) => {
    const binaryPath = path.join('release', binary)
    return rename(binaryPath, binaryPath.replace('windows-4.0', 'win32'))
  })
)