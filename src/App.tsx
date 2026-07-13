import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import './index.css'
import './App.css'
import StatusModal from './components/StatusModal'

const ASSETS = '/event-2m'
const MOBILE_BREAKPOINT = 768

const PC_DESIGN = { width: 1920, height: 1080 }
const MB_DESIGN = { width: 440, height: 956 }

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

  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? ''
  const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

  const design = isMobile ? MB_DESIGN : PC_DESIGN

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const updateIsMobile = () => setIsMobile(mediaQuery.matches)

    updateIsMobile()
    mediaQuery.addEventListener('change', updateIsMobile)
    return () => mediaQuery.removeEventListener('change', updateIsMobile)
  }, [])

  useEffect(() => {
    const updateLayoutScale = () => {
      const horizontalPadding = isMobile ? 0 : 0
      const availableWidth = window.innerWidth - horizontalPadding
      setLayoutScale(Math.min(1, availableWidth / design.width))
    }

    updateLayoutScale()
    window.addEventListener('resize', updateLayoutScale)
    return () => window.removeEventListener('resize', updateLayoutScale)
  }, [isMobile, design.width])

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

  const scaledWidth = design.width * layoutScale
  const scaledHeight = design.height * layoutScale

  return (
    <>
      <div className="event-2m">
        <img
          src={isMobile ? `${ASSETS}/bg-mb.png` : `${ASSETS}/bg-pc.png`}
          alt=""
          className="event-2m__bg"
          aria-hidden
        />

        <div
          className="event-2m__canvas-wrap"
          style={{ width: scaledWidth, height: scaledHeight }}
        >
          <div
            className="event-2m__canvas"
            style={{
              width: design.width,
              height: design.height,
              transform: `scale(${layoutScale})`,
            }}
          >
            <img
              src={`${ASSETS}/logo-2m-memmber.png`}
              alt="Đại tiệc chào mừng 2 triệu thành viên"
              className="event-2m__logo"
            />

            <img
              src={isMobile ? `${ASSETS}/banner-home-mb.png` : `${ASSETS}/banner-home.png`}
              alt="Phần thưởng 2 triệu thành viên"
              className="event-2m__banner"
            />

            <div className="event-2m__popup">
              <img
                src={`${ASSETS}/bg-popup.png`}
                alt=""
                className="event-2m__popup-bg"
                aria-hidden
              />
              <img
                src={`${ASSETS}/title-popup.png`}
                alt="Nhập code khuyến mãi"
                className="event-2m__popup-title"
              />
              <form onSubmit={handleSubmit} className="event-2m__form">
                <div className="event-2m__field">
                  <label htmlFor="accountId" className="event-2m__label">
                    Tên tài khoản:
                  </label>
                  <input
                    id="accountId"
                    type="text"
                    placeholder="Nhập tên người dùng"
                    className="event-2m__input"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                  />
                </div>

                <div className="event-2m__field">
                  <label htmlFor="code" className="event-2m__label">
                    Mã code khuyến mãi:
                  </label>
                  <input
                    id="code"
                    type="text"
                    placeholder="Nhập mã code"
                    className="event-2m__input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <div className="event-2m__field event-2m__field--captcha">
                  <div className="event-2m__captcha">
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
                      <span className="event-2m__captcha-error">
                        Thiếu cấu hình TURNSTILE_SITE_KEY
                      </span>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="event-2m__submit">
                  <img
                    src={`${ASSETS}/btn-check.png`}
                    alt="Kiểm tra ngay"
                    className="event-2m__submit-img"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {popup && <StatusModal type={popup.type} message={popup.message} onClose={closePopup} />}
    </>
  )
}

export default App
