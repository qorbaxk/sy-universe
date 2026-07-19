import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import {
  CHROME_HARDWARE_SETTINGS_URL,
  prepareChromeHardwareSettings,
} from '../lib/chromeHardwareSettings'
import './WebGLEnableBanner.css'

export function WebGLEnableBanner() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const openGuide = async () => {
    setBusy(true)
    try {
      await prepareChromeHardwareSettings()
      setCopied(true)
      setOpen(true)
    } catch {
      setCopied(false)
      setOpen(true)
    } finally {
      setBusy(false)
    }
  }

  const copyAgain = async () => {
    try {
      await prepareChromeHardwareSettings()
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="webgl-banner"
        onClick={openGuide}
        disabled={busy}
      >
        WebGL이 꺼져 있어 2D로 보는 중 · <strong>클릭해서 3D 설정 열기</strong>
      </button>

      <Modal
        open={open}
        title="3D로 보려면 하드웨어 가속 ON"
        onClose={() => setOpen(false)}
      >
        <p className="webgl-guide__lead">
          보안상 웹사이트가 Chrome 설정을 직접 바꿀 수는 없어요. 대신 설정
          주소를 복사해 두었으니, 주소창에 붙여넣으면 바로 해당 화면으로
          갈 수 있어요.
        </p>

        <ol className="webgl-guide__steps">
          <li>설정 주소 복사 (이미 복사됨)</li>
          <li>
            Chrome 주소창에 붙여넣기 → Enter
            <code>{CHROME_HARDWARE_SETTINGS_URL}</code>
          </li>
          <li>
            <strong>사용 가능한 경우 하드웨어 가속 사용</strong> 켜기
          </li>
          <li>Chrome 완전 종료 후 재실행 → 이 페이지 새로고침</li>
        </ol>

        <div className="webgl-guide__actions">
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
