/**
 * @alias 부트 스플래시 숨김
 * @description index.html의 `#boot-splash`를 페이드아웃 후 제거한다. 흰 화면 플래시를 막기 위한 초기 오버레이.
 */
export function hideBootSplash() {
  const splash = document.getElementById('boot-splash')
  if (!splash || splash.classList.contains('is-hidden')) return

  splash.classList.add('is-hidden')
  splash.setAttribute('aria-busy', 'false')

  window.setTimeout(() => {
    splash.remove()
  }, 400)
}
