import { dlopen, FFIType, suffix } from 'bun:ffi'

const { platform, arch } = process

let filename: string

if (arch === 'x64') {
  filename = `../release/promptx-${platform}-amd64.${suffix}`
} else {
  filename = `../release/promptx-${platform}-${arch}.${suffix}`
}

const location = Bun.fileURLToPath(new URL(filename, import.meta.url))
export const { symbols } = dlopen(location, {
  CreateSelection: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.int],
    returns: FFIType.ptr
  },
  CreatePrompt: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.bool, FFIType.int],
    returns: FFIType.ptr
  },
  FreeString: {
    args: [FFIType.ptr],
    returns: FFIType.void
  }
})
