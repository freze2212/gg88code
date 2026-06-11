import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import './index.css'
import './App.css'
import StatusModal from './components/StatusModal'

const ASSETS = '/event-wc'
const HOME_URL_PC = 'https://gg88-cd.pages.dev/'
const HOME_URL_MB = 'https://gg88-cd-link-mb.pages.dev/'
const PROMO_BANNERS = [
  {
    src: `${ASSETS}/km-1.png`,
    href: 'https://www.gg8809.com/home/event/detail?current=10011&template=14&eventId=258',
    label: 'X88',
  },
  {
    src: `${ASSETS}/km-2.png`,
    href: 'https://www.gg8809.com/home/event/detail?current=10011&template=12&eventId=234',
    label: 'WC01',
  },
  {
    src: `${ASSETS}/km-3.png`,
    href: 'https://www.gg8809.com/home/event/detail?current=10011&template=24&eventId=259',
    label: 'TOPTT',
  },
  {
    src: `${ASSETS}/km-4.png`,
    href: 'https://www.gg8809.com/home/event/detail?current=10011&template=1&eventId=262',
    label: 'BH100',
  },
  {
    src: `${ASSETS}/km-5.png`,
    href: 'https://www.gg8809.com/home/event/detail?current=10011&template=1&eventId=266',
    label: 'WCNT',
  },
  {
    src: `${ASSETS}/km-6.png`,
    href: 'https://www.gg8809.com/home/event/detail?current=10011&template=1&eventId=254',
    label: 'DDWC',
  },
] as const
const LAYOUT_WIDTH = 1645
const LAYOUT_HEIGHT_FALLBACK = 808

const MOBILE_BREAKPOINT = 768

type UseCodeErrorResponse = {
  data?: { message?: string }
  message?: string
}

type UseCodeSuccessResponse = {
  data?: {
    pointsAdded?: number
    message?: string
  }
  message?: string
}

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

  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? ''
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
      setPopup({ type: 'error', message: 'Vui lòng hoàn thành xác thực bảo mật (Cloudflare).' })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/codes/use-code-public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedAccount.toLowerCase(),
          code: trimmedCode,
          captchaToken,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Sử dụng code thất bại. Vui lòng thử lại.'
        try {
          const errorData = (await response.json()) as UseCodeErrorResponse
          if (errorData?.data?.message) {
            errorMessage = errorData.data.message
          } else if (errorData?.message) {
            errorMessage = errorData.message
          }
        } catch {
          // ignore parse errors
        }
        throw new Error(errorMessage)
      }

      const responseData = (await response.json()) as UseCodeSuccessResponse
      const pointsAdded = responseData.data?.pointsAdded ?? 0
      const successMessage = `Chúc mừng, bạn nhận được ${pointsAdded.toLocaleString('vi-VN')}K !!`

      setPopup({
        type: 'success',
        message: successMessage,
      })
      setCaptchaToken(null)
    } catch (error) {
      setPopup({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Sử dụng code thất bại. Vui lòng thử lại.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const closePopup = () => setPopup(null)
  const homeUrl = isMobile ? HOME_URL_MB : HOME_URL_PC

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
          <a
            href={homeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="site-header__logo-link"
          >
            <img src={`${ASSETS}/logo.png`} alt="GG88" className="site-header__logo" />
          </a>
          <a href={homeUrl} target="_blank" rel="noopener noreferrer" className="site-header__home-link">
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
                <div className="bottom-banner__grid">
                  {PROMO_BANNERS.map((banner) => (
                    <a
                      key={banner.src}
                      href={banner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bottom-banner__link"
                    >
                      <img
                        src={banner.src}
                        alt={`Khuyến mãi ${banner.label}`}
                        className="bottom-banner__item"
                      />
                    </a>
                  ))}
                </div>
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
