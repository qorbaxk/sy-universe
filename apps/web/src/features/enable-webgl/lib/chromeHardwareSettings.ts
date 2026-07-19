export const CHROME_HARDWARE_SETTINGS_URL = 'chrome://settings/system'

export async function copyChromeHardwareSettingsUrl() {
  await navigator.clipboard.writeText(CHROME_HARDWARE_SETTINGS_URL)
  return CHROME_HARDWARE_SETTINGS_URL
}

/** 웹페이지에서 chrome:// 직접 이동은 브라우저가 막음. 복사 + 안내가 현실적인 UX */
export async function prepareChromeHardwareSettings() {
  const url = await copyChromeHardwareSettingsUrl()
  return {
    url,
    steps: [
      '아래 버튼으로 설정 주소를 복사했어요.',
      'Chrome 주소창에 붙여넣고 Enter를 누르세요.',
      '「사용 가능한 경우 하드웨어 가속 사용」을 켜세요.',
      'Chrome을 완전히 종료했다가 다시 실행한 뒤 이 페이지를 새로고침하세요.',
    ],
  }
}
