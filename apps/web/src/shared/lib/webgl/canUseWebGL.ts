export function canUseWebGL() {
  if (typeof document === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('experimental-webgl', {
        failIfMajorPerformanceCaveat: false,
      })

    if (!gl) return false

    const debugInfo = (
      gl as WebGLRenderingContext
    ).getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(
        debugInfo.UNMASKED_RENDERER_WEBGL,
      )
      if (
        typeof renderer === 'string' &&
        /disabled|microsoft basic render/i.test(renderer)
      ) {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}
