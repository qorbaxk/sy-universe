import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { useChromeHardwareGuide } from '../hooks/useChromeHardwareGuide'
import { CHROME_HARDWARE_SETTINGS_URL } from '../lib/chromeHardwareSettings'

/**
 * @alias WebGL 안내 배너
 * @description 2D 폴백 중일 때 하드웨어 가속 설정 가이드를 연다.
 */
export function WebGLEnableBanner() {
  const { open, copied, busy, openGuide, copyAgain, closeGuide } =
    useChromeHardwareGuide()

  return (
    <>
      <button
        type="button"
        className="absolute bottom-5 left-1/2 z-30 max-w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 rounded-full border border-white/12 bg-[#0b1118]/9 px-4 py-2 text-xs text-muted shadow-lg backdrop-blur-md transition hover:border-accent/40 hover:text-ink"
        onClick={openGuide}
        disabled={busy}
      >
        WebGL이 꺼져 있어 2D로 보는 중 ·{' '}
        <strong className="text-accent">클릭해서 3D 설정 열기</strong>
      </button>

      <Modal
        open={open}
        title="3D로 보려면 하드웨어 가속 ON"
        onClose={closeGuide}
      >
        <p className="mb-3 text-sm text-muted">
          보안상 웹사이트가 Chrome 설정을 직접 바꿀 수는 없어요. 대신 설정
          주소를 복사해 두었으니, 주소창에 붙여넣으면 바로 해당 화면으로 갈 수
          있어요.
        </p>

        <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>설정 주소 복사 (이미 복사됨)</li>
          <li>
            Chrome 주소창에 붙여넣기 → Enter
            <code className="mt-1 block rounded bg-white/5 px-2 py-1 text-xs text-accent-2">
              {CHROME_HARDWARE_SETTINGS_URL}
            </code>
          </li>
          <li>
            <strong className="text-ink">
              사용 가능한 경우 하드웨어 가속 사용
            </strong>{' '}
            켜기
          </li>
          <li>Chrome 완전 종료 후 재실행 → 이 페이지 새로고침</li>
        </ol>

        <div className="flex flex-wrap gap-2">
          <Button variant="accent" onClick={copyAgain}>
            {copied ? '설정 주소 다시 복사됨' : '설정 주소 복사하기'}
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            설정 후 새로고침
          </Button>
        </div>
      </Modal>
    </>
  )
}
