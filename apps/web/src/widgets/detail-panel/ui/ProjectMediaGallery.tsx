import type { ProjectMedia } from '@/entities/portfolio'
import { publicAssetUrl } from '@/shared/lib/url/publicAssetUrl'

type ProjectMediaGalleryProps = {
  /**
   * @alias 미디어 목록
   * @description 프로젝트 캡처·데모 이미지.
   */
  media: ProjectMedia[]
}

/**
 * @alias 프로젝트 미디어 갤러리
 * @description 화면 캡처를 먼저 보여 이해 속도를 높인다.
 */
export function ProjectMediaGallery({ media }: ProjectMediaGalleryProps) {
  if (media.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-[0.92rem] font-semibold text-accent-2">화면 캡처</h3>
      <ul className="space-y-3">
        {media.map((item) => (
          <li key={item.src} className="space-y-1.5">
            <figure className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
              <img
                src={publicAssetUrl(item.src)}
                alt={item.alt}
                loading="lazy"
                className="block w-full object-cover object-top"
              />
            </figure>
            {item.caption && (
              <p className="text-xs leading-relaxed text-muted">{item.caption}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
