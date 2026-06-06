import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import './index.css'
import './App.css'
import StatusModal from './components/StatusModal'
import { DEFAULT_PRIZE_OPTIONS, getConfiguredPrize } from './lib/prizeConfig'

const ASSETS = '/event-wc'
const HOME_URL = 'https://gg88-cd-demo.pages.dev'
const LAYOUT_WIDTH = 1645
const LAYOUT_HEIGHT_FALLBACK = 808

const MOBILE_BREAKPOINT = 768

function App() {
  const [accountId, setAccountId] = useState('')
  const [code, setCode] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [popup, setPopup] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches,
  )
  const [layoutScale, setLayoutScale] = useState(1)
  const [layoutHeight, setLayoutHeight] = useState(LAYOUT_HEIGHT_FALLBACK)
  const layoutRef = useRef<HTMLDivElement>(null)

  const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const updateIsMobile = () => setIsMobile(mediaQuery.matches)

    updateIsMobile()
    mediaQuery.addEventListener('change', updateIsMobile)
    return () => mediaQuery.removeEventListener('change', updateIsMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const updateLayoutScale = () => {
      const availableWidth = window.innerWidth - 96
      setLayoutScale(Math.min(1, availableWidth / LAYOUT_WIDTH))
    }

    updateLayoutScale()
    window.addEventListener('resize', updateLayoutScale)
    return () => window.removeEventListener('resize', updateLayoutScale)
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return

    const layoutEl = layoutRef.current
    if (!layoutEl) return

    const updateLayoutHeight = () => {
      setLayoutHeight(layoutEl.scrollHeight || LAYOUT_HEIGHT_FALLBACK)
    }

    updateLayoutHeight()

    const observer = new ResizeObserver(updateLayoutHeight)
    observer.observe(layoutEl)

    window.addEventListener('load', updateLayoutHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('load', updateLayoutHeight)
    }
  }, [isMobile, layoutScale])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPopup(null)

    const trimmedAccount = accountId.trim()
    const trimmedCode = code.trim()

    if (!trimmedAccount) {
      setPopup({ type: 'error', message: 'Vui lòng nhập tài khoản.' })
      return
    }

    if (!trimmedCode) {
      setPopup({ type: 'error', message: 'Vui lòng nhập mã CODE.' })
      return
    }

    if (!captchaToken) {
      setPopup({ type: 'error', message: 'Vui lòng hoàn thành xác thực bảo mật.' })
      return
    }

    setIsLoading(true)

    await new Promise((resolve) => window.setTimeout(resolve, 300))

    const configuredPrize = getConfiguredPrize(trimmedAccount)
    const pointsAdded =
      configuredPrize ??
      DEFAULT_PRIZE_OPTIONS[Math.floor(Math.random() * DEFAULT_PRIZE_OPTIONS.length)]

    setPopup({
      type: 'success',
      message: `Chúc mừng, bạn nhận được ${pointsAdded.toLocaleString('vi-VN')}K !!`,
    })

    setCaptchaToken(null)
    setIsLoading(false)
    window.setTimeout(() => {
      window.location.reload()
    }, 1200)
  }

  const closePopup = () => setPopup(null)

  return (
    <>
      <div className="page-wrapper">
        <video
          className="bg-video bg-video--mobile"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src={`${ASSETS}/bg-mb-wc.mp4`} type="video/mp4" />
        </video>
        <video
          className="bg-video bg-video--desktop"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src={`${ASSETS}/bg-pc-wc.mp4`} type="video/mp4" />
        </video>

        <header className="site-header">
          <img src={`${ASSETS}/logo.png`} alt="GG88" className="site-header__logo" />
          <a href={HOME_URL} target="_blank" rel="noopener noreferrer" className="site-header__home-link">
            <img src={`${ASSETS}/btn-home.png`} alt="Trang chủ" className="site-header__home" />
          </a>
        </header>

        <main className="site-main">
          <div
            className={`layout-scaler-wrap${isMobile ? ' layout-scaler-wrap--mobile' : ''}`}
            style={
              isMobile
                ? undefined
                : {
                    width: `${LAYOUT_WIDTH * layoutScale}px`,
                    height: `${layoutHeight * layoutScale}px`,
                  }
            }
          >
            <div
              ref={layoutRef}
              className={`layout-scaler${isMobile ? ' layout-scaler--mobile' : ''}`}
              style={
                isMobile
                  ? undefined
                  : {
                      width: `${LAYOUT_WIDTH}px`,
                      transform: `scale(${layoutScale})`,
                      transformOrigin: 'top left',
                    }
              }
            >
              <div className="content-row">
                <div className="popup-panel-wrap">
                  <div className="popup-panel">
                    <img
                      src={`${ASSETS}/bg-modal.png`}
                      alt=""
                      className="popup-panel__bg"
                      aria-hidden
                    />
                    <img
                      src={`${ASSETS}/text-title.png`}
                      alt="NHẬP CODE FREE"
                      className="form-title"
                    />
                    <form onSubmit={handleSubmit} className="popup-panel__form">
                      <div className="form-field">
                        <label htmlFor="accountId" className="form-label">
                          Tên tài khoản:
                        </label>
                        <div className="form-input-wrap">
                          <img
                            src={`${ASSETS}/icon-user.png`}
                            alt=""
                            className="form-input-icon"
                            aria-hidden
                          />
                          <input
                            id="accountId"
                            type="text"
                            placeholder="Nhập tên người dùng"
                            className="form-input"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label htmlFor="code" className="form-label">
                          Mã code:
                        </label>
                        <div className="form-input-wrap">
                          <img
                            src={`${ASSETS}/icon-promo.png`}
                            alt=""
                            className="form-input-icon"
                            aria-hidden
                          />
                          <input
                            id="code"
                            type="text"
                            placeholder="Nhập mã code"
                            className="form-input"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <div className="form-captcha">
                          {TURNSTILE_SITE_KEY ? (
                            <Turnstile
                              siteKey={TURNSTILE_SITE_KEY}
                              onSuccess={(token) => setCaptchaToken(token)}
                              onExpire={() => setCaptchaToken(null)}
                              options={{
                                theme: 'light',
                                size: 'normal',
                                language: 'vi',
                              }}
                            />
                          ) : (
                            <span className="form-captcha-error">
                              Thiếu cấu hình TURNSTILE_SITE_KEY
                            </span>
                          )}
                        </div>
                      </div>

                      <button type="submit" disabled={isLoading} className="form-submit">
                        <img
                          src={`${ASSETS}/btn-get-code.png`}
                          alt="Nhận code"
                          className="form-submit__img"
                        />
                      </button>
                    </form>
                  </div>
                </div>

                <div className="reward-panel-wrap">
                  <div className="reward-panel">
                    <img
                      src={`${ASSETS}/banner-reward.png`}
                      alt="Phần thưởng"
                      className="reward-panel__img"
                    />
                  </div>
                </div>
              </div>

              <div className="bottom-banner">
                <img
                  src={`${ASSETS}/banner.png`}
                  alt="Banner sự kiện"
                  className="bottom-banner__img bottom-banner__img--pc"
                />
                <img
                  src={`${ASSETS}/banner-mb.png`}
                  alt="Banner sự kiện"
                  className="bottom-banner__img bottom-banner__img--mb"
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {popup && <StatusModal type={popup.type} message={popup.message} onClose={closePopup} />}
    </>
  )
}

export default App
