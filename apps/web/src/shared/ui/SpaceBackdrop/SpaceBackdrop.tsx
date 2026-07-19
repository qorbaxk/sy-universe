const spaceImage = `${import.meta.env.BASE_URL}media/space-bg.png`

/**
 * @alias 우주 배경
 * @description 그래프 뒤의 풀블리드 우주 이미지 + 미묘한 별/글로우 레이어.
 */
export function SpaceBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${spaceImage})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(2,5,12,0.45)_75%,rgba(2,5,12,0.85)_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(1px_1px_at_20%_30%,rgba(255,255,255,0.55),transparent),radial-gradient(1px_1px_at_70%_60%,rgba(255,255,255,0.35),transparent),radial-gradient(1px_1px_at_40%_80%,rgba(255,255,255,0.25),transparent)]" />
      <div className="absolute top-1/3 left-1/2 size-[42vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,184,109,0.14),transparent_65%)]" />
    </div>
  )
}
