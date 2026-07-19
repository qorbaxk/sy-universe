import { useState } from 'react'
import { prepareChromeHardwareSettings } from '../lib/chromeHardwareSettings'

/**
 * @alias Chrome 하드웨어 가속 가이드 훅
 * @description 설정 URL 복사·모달 열림 상태를 관리한다.
 */
export function useChromeHardwareGuide() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  /**
   * @alias 가이드 열기
   * @description 주소를 복사한 뒤 모달을 연다.
   */
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

  /**
   * @alias 주소 재복사
   * @description 모달 안에서 설정 URL을 다시 복사한다.
   */
  const copyAgain = async () => {
    try {
      await prepareChromeHardwareSettings()
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return {
    open,
    copied,
    busy,
    openGuide,
    copyAgain,
    closeGuide: () => setOpen(false),
  }
}
