import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import './index.css'
import './App.css'
import StatusModal from './components/StatusModal'

function App() {
  const [accountId, setAccountId] = useState('')
  const [code, setCode] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [popup, setPopup] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [scale, setScale] = useState(1)

  const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
  const prizeOptions = [
    38, 68, 88, 138, 168, 188, 238, 268, 288, 338, 368, 388, 438, 468, 488, 538, 568, 588,
    638, 668, 688, 738, 768, 788, 838, 868, 888,
  ]

  useEffect(() => {
    const calculateScale = () => {
      if (window.innerWidth < 768 && window.innerWidth < 421) {
        setScale(window.innerWidth / 421)
      } else {
        setScale(1)
      }
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

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

    const pointsAdded = prizeOptions[Math.floor(Math.random() * prizeOptions.length)]

    setPopup({
      type: 'success',
      message: `Chúc mừng, bạn nhận được ${pointsAdded.toLocaleString('vi-VN')} điểm !!`,
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
      <div className="relative min-h-screen">
        <div className="block md:hidden absolute top-0 left-0 w-screen z-0 pointer-events-none">
          <img
            src="/bg-mb.webp"
            alt="Mobile background"
            className="w-screen h-auto object-contain"
            style={{ width: '100vw' }}
          />
        </div>
        <div
          className="hidden md:block absolute inset-0 w-screen z-0 pointer-events-none"
          style={{ minHeight: '100%', height: '100%' }}
        >
          <img
            src="/bg-pc.png"
            alt="PC background"
            className="w-screen h-full object-cover"
            style={{ width: '100vw', minHeight: '100vh', height: '100%' }}
          />
        </div>
        <main
          className="main-background main-background-mobile w-full flex items-start md:items-start justify-center px-4 sm:px-[22px] md:px-8 relative z-10"
          aria-label="Landing background"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 md:hidden z-20">
            <a
              href="https://gg88-cd-demo.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <img src="/home.webp" alt="Home" className="w-[120px] h-auto object-contain" />
            </a>
          </div>
          <div className="hidden md:block fixed top-6 right-8 z-20">
            <a
              href="https://gg88-cd-demo.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <img
                src="/home.webp"
                alt="Home"
                className="w-[140px] h-auto md:w-[212px] md:h-[48px] object-contain"
              />
            </a>
          </div>

          <div
            className="flex flex-col items-center pt-0 md:pt-[10px] gap-0 sm:gap-[18px] md:gap-6 w-[421px] md:w-auto origin-top mt-[20%] md:mt-0 md:mr-[30%]"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
          >
            <img
              src="/logo.webp"
              alt="Get Gift logo"
              className="w-[262px] h-[45px] md:w-[590px] md:h-[100px] object-contain mb-3 md:mb-0 float-logo"
            />
            <img
              src="text-logo.webp"
              alt="Text logo"
              className="w-[250px] h-[23px] md:w-[561px] md:h-[51px] object-contain"
            />

            <div className="relative w-full flex items-center justify-center mt-[2.5rem] sm:mt-[14px] md:mt-4">
              <form
                onSubmit={handleSubmit}
                className="w-full text-[13px] sm:text-[14px] md:text-[16px] text-[#082047]"
              >
                <div className="w-full flex justify-center items-center">
                  <div className="relative w-[421px] md:w-[717px] h-[418px] md:h-[712px] flex-shrink-0 rounded-[22px] sm:rounded-[24px] md:rounded-[26px] overflow-visible">
                    <picture>
                      <source media="(min-width: 768px)" srcSet="/bg-modal-pc.webp" />
                      <img
                        src="/bg-modal-mb.webp"
                        alt="Modal background"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </picture>

                    <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-6 sm:-top-8 md:-top-8 flex justify-center w-[352px] sm:w-[352px] md:w-[601px] h-[70px] sm:h-[70px] md:h-[119px]">
                      <img
                        src="/title-modal.webp"
                        alt="NHẬP CODE FREE"
                        className="w-full h-full object-contain animate-title-modal"
                      />
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center px-4 sm:px-6 md:px-8 pt-16 sm:pt-14 md:pt-20 pb-6 gap-4 sm:gap-5 md:gap-6">
                      <div className="w-full md:w-[485px] md:h-[350px] flex flex-col items-center md:items-start justify-start space-y-2.5 sm:space-y-3 md:space-y-3.5">
                        <div className="space-y-1 mt-2 sm:mt-3 md:mt-8 flex flex-col items-start">
                          <label
                            className="block text-[13.97px] md:text-[23.78px] uppercase tracking-[-0.02em] text-[#00695c] text-left"
                            style={{
                              fontFamily:
                                'SVN-Gilroy, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                              fontWeight: 700,
                              lineHeight: '100%',
                            }}
                          >
                            TÀI KHOẢN
                          </label>
                          <input
                            type="text"
                            placeholder="Nhập tài khoản"
                            className="w-[285px] md:w-[485px] h-[30px] md:h-[51px] rounded-lg border border-[rgba(37,196,175,1)] bg-white/95 px-3 sm:px-3.5 md:px-4 text-[13px] sm:text-[14px] md:text-[15px] text-[#1f2933] outline-none placeholder:text-[#9ca3af] focus:border-[rgba(37,196,175,1)] focus:ring-0"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1 flex flex-col items-start">
                          <label
                            className="block text-[13.97px] md:text-[23.78px] uppercase tracking-[-0.02em] text-[#00695c] text-left drop-shadow"
                            style={{
                              fontFamily:
                                'SVN-Gilroy, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                              fontWeight: 700,
                              lineHeight: '100%',
                            }}
                          >
                            MÃ CODE
                          </label>
                          <input
                            type="text"
                            placeholder="Nhập mã CODE"
                            className="w-[285px] md:w-[485px] h-[30px] md:h-[51px] rounded-lg border border-[rgba(37,196,175,1)] bg-white/95 px-3 sm:px-3.5 md:px-4 text-[13px] sm:text-[14px] md:text-[15px] text-[#1f2933] outline-none placeholder:text-[#9ca3af] focus:border-[rgba(37,196,175,1)] focus:ring-0"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1 flex flex-col items-start">
                          <label
                            className="block text-[13.97px] md:text-[23.78px] uppercase tracking-[-0.02em] text-[#00695c] text-left drop-shadow"
                            style={{
                              fontFamily:
                                'SVN-Gilroy, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                              fontWeight: 700,
                              lineHeight: '100%',
                            }}
                          >
                            XÁC THỰC
                          </label>
                          <div className="w-[285px] md:w-auto flex justify-center md:justify-start">
                            {TURNSTILE_SITE_KEY ? (
                              <div className="w-full flex justify-center">
                                <div
                                  className="flex justify-center md:scale-100 md:w-auto w-[150px] scale-[0.85]"
                                  style={{ transformOrigin: 'top center' }}
                                >
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
                                </div>
                              </div>
                            ) : (
                              <span className="text-[12px] sm:text-[13px] text-red-200">
                                Thiếu cấu hình TURNSTILE_SITE_KEY
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-[485px] flex justify-center">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex items-center justify-center disabled:opacity-70 disabled:cursor-progress group"
                        >
                          <img
                            src="/btn-get.webp"
                            alt="Nhận"
                            className="w-[190px] h-[42px] sm:w-[210px] md:w-[317px] md:h-[72px] object-contain group-hover:brightness-110 transition-all duration-200"
                          />
                        </button>
                      </div>

                      <div className="w-[285px] md:w-[485px] space-y-2 sm:space-y-3 mt-2 sm:mt-3 md:mt-10 flex flex-col items-start">
                        <div
                          className="flex items-center justify-between text-[11.35px] md:text-[19.33px] tracking-[-0.02em] drop-shadow w-full"
                          style={{
                            fontFamily:
                              'SVN-Gilroy, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                            fontWeight: 500,
                            lineHeight: '100%',
                          }}
                        >
                          <button
                            type="button"
                            className="text-[rgba(255,106,0,1)] hover:opacity-90 animate-gentle-shake"
                          >
                            Đăng nhập
                          </button>
                          <span className="text-center flex-1 text-[rgb(0, 0, 0)]">
                            Bạn chưa có tài khoản?
                          </span>
                          <button
                            type="button"
                            className="text-[rgba(255,106,0,1)] hover:opacity-90 text-right animate-gentle-shake-delay-2"
                          >
                            Đăng ký
                          </button>
                        </div>

                        <div
                          className="flex items-center justify-between text-[11.35px] md:text-[19.33px] tracking-[-0.02em] drop-shadow mt-1 w-full"
                          style={{
                            fontFamily:
                              'SVN-Gilroy, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                            fontWeight: 500,
                            lineHeight: '100%',
                          }}
                        >
                          <span className="text-[rgba(255,106,0,1)] animate-gentle-shake-delay-3">
                            Theo dõi thêm:
                          </span>
                          <div className="flex items-center gap-2">
                            <a
                              href="https://t.me/addlist/vF1_6vYe7gZiMTFl"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer"
                            >
                              <img
                                src="/icon-tele.webp"
                                alt="Telegram"
                                className="w-[19px] h-[19px] md:w-8 md:h-8 object-contain animate-gentle-shake-icon hover:scale-110 transition-transform duration-200"
                              />
                            </a>
                            <a
                              href="https://www.facebook.com/GG88Members/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer"
                            >
                              <img
                                src="/icon-fb.webp"
                                alt="Facebook"
                                className="w-[19px] h-[19px] md:w-8 md:h-8 object-contain animate-gentle-shake-icon-delay-1 hover:scale-110 transition-transform duration-200"
                              />
                            </a>
                            <a
                              href="https://www.tiktok.com/@giaitri_vuontamdangcap"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer"
                            >
                              <img
                                src="/icon-tiktok.webp"
                                alt="TikTok"
                                className="w-[19px] h-[19px] md:w-8 md:h-8 object-contain animate-gentle-shake-icon-delay-2 hover:scale-110 transition-transform duration-200"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      {popup && <StatusModal type={popup.type} message={popup.message} onClose={closePopup} />}
    </>
  )
}

export default App
