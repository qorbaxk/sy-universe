import './SpaceBackdrop.css'

const spaceImage = `${import.meta.env.BASE_URL}media/space-bg.png`

export function SpaceBackdrop() {
  return (
    <div className="space-backdrop" aria-hidden>
      <div
        className="space-backdrop__image"
        style={{ backgroundImage: `url(${spaceImage})` }}
      />
      <div className="space-backdrop__veil" />
      <div className="space-backdrop__stars space-backdrop__stars--a" />
      <div className="space-backdrop__stars space-backdrop__stars--b" />
      <div className="space-backdrop__glow" />
    </div>
  )
}
