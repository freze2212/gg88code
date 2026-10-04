import type { FormEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { Toaster, toast } from 'sonner'
import './index.css'
import './App.css'
import { getConfiguredPrize, getRandomPrizeK } from './lib/prizeConfig'

const HOME_URL = 'https://gg88-cd-demo.pages.dev'
const PROGRAM_INFO_URL = '#'
const CODE_DISTRIBUTION_URL = 'https://t.me/code_gg88'
const TELEGRAM_URL = 'https://t.me/GIAITRIGG88'
const FACEBOOK_URL = 'https://www.facebook.com/congdonggg88vn/'

const TURNSTILE_WIDTH = 300
const TURNSTILE_HEIGHT = 65
const SUCCESS_TOAST_DURATION_MS = 4000

type FormErrors = { accountId?: string; code?: string; captcha?: string }

function App() {
  const [accountId, setAccountId] = useState('')
  const [code, setCode] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    window.location.href = HOME_URL
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedAccount = accountId.trim()
    const trimmedCode = code.trim()

    const nextErrors: FormErrors = {}
    if (!trimmedAccount) nextErrors.accountId = 'Vui lòng nhập tên tài khoản'
    if (!trimmedCode) nextErrors.code = 'Vui lòng nhập mã code'
    if (!captchaToken) nextErrors.captcha = 'Vui lòng xác thực captcha'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length || isLoading) return

    setIsLoading(true)

    await new Promise((resolve) => window.setTimeout(resolve, 300))

    const configuredPrize = getConfiguredPrize(trimmedAccount)
    const pointsAdded = configuredPrize ?? getRandomPrizeK()

    toast.success(
      `Chúc mừng ${trimmedAccount} đã nhận thành công ${pointsAdded.toLocaleString('vi-VN')} điểm`,
      { duration: SUCCESS_TOAST_DURATION_MS },
    )

    setCaptchaToken(null)
    window.setTimeout(() => {
      window.location.reload()
    }, SUCCESS_TOAST_DURATION_MS)
  }

  return (
    <>
      <div className="enter-code-page flex min-h-dvh justify-center bg-[#f0f0f0]">
        <main
          className="relative flex min-h-dvh w-full max-w-[440px] flex-col bg-[#C9F7F3] bg-no-repeat pb-8 shadow-[0_0_24px_rgba(0,0,0,0.06)]"
          style={{
            backgroundImage: "url('/images/backgrounds/background3.png')",
            backgroundSize: '100% auto',
          }}
        >
          <div className="flex w-full flex-col items-center px-2.5 pt-2">
            <div className="relative w-full shrink-0">
              <div className="flex items-center justify-between gap-3 px-1">
                <div className="min-w-0 text-left leading-snug text-[#25C4AF]">
                  <p className="text-[13px] font-medium">Đối tác chính thức</p>
                  <p className="text-[16px] font-bold">Athletic Club</p>
                  <p className="text-[13px] font-medium">Năm 2026-2027</p>
                </div>
                <img
                  src="/images/logos/logo4.png"
                  alt="Athletic Club — GG88"
                  width={964}
                  height={184}
                  className="h-auto w-[54%] max-w-[240px] shrink-0 object-contain"
                />
              </div>
              <button
                type="button"
                onClick={handleBack}
                aria-label="Quay lại"
                className="absolute left-0.5 top-[calc(100%+0.25rem)] z-30 inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-transform active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-7"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            </div>

            <img
              src="/images/mascots/mascot3.png"
              alt="Nhập code GG88 Free"
              width={1448}
              height={1268}
              className="relative z-20 mt-4 h-auto w-[72%] shrink-0 object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.28)]"
            />

            <form
              onSubmit={handleSubmit}
              className="enter-code-board relative z-10 -mt-4 w-[92%] px-5 pb-4 pt-5 text-center"
            >
              <Field
                id="enter-code-account"
                label="Tên tài khoản"
                placeholder="Nhập tên người dùng"
                value={accountId}
                error={errors.accountId}
                onChange={(value) => {
                  setAccountId(value)
                  setErrors((prev) => ({ ...prev, accountId: undefined }))
                }}
              />

              <Field
                id="enter-code-code"
                label="Mã code"
                placeholder="Nhập mã code"
                value={code}
                error={errors.code}
                className="mt-3.5"
                onChange={(value) => {
                  setCode(value)
                  setErrors((prev) => ({ ...prev, code: undefined }))
                }}
              />

              <div className="mt-3.5 min-w-0">
                {TURNSTILE_SITE_KEY ? (
                  <ScaledTurnstile>
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      onSuccess={(token) => {
                        setCaptchaToken(token)
                        setErrors((prev) => ({ ...prev, captcha: undefined }))
                      }}
                      onExpire={() => setCaptchaToken(null)}
                      onError={() => setCaptchaToken(null)}
                      options={{
                        theme: 'light',
                        size: 'normal',
                        language: 'vi',
                      }}
                    />
                  </ScaledTurnstile>
                ) : (
                  <p className="text-center text-[11px] text-[#FFD0A8]">
                    Thiếu cấu hình xác thực Turnstile
                  </p>
                )}
                {errors.captcha ? (
                  <p className="mt-1 text-center text-[11px] text-[#FFD0A8]">{errors.captcha}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                aria-label="Kiểm tra"
                className={`mx-auto mt-3 block transition-[transform,filter] duration-200 hover:brightness-110 active:scale-[0.97] ${
                  isLoading ? 'pointer-events-none opacity-60' : ''
                }`}
              >
                <img
                  src="/images/buttons/button1.png"
                  alt="KIỂM TRA"
                  width={216}
                  height={78}
                  className="h-auto w-[180px]"
                />
              </button>

              <div className="mt-4 flex flex-col items-center gap-2.5">
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
                  <InfoLink href={PROGRAM_INFO_URL}>Thông tin chương trình</InfoLink>
                  <InfoLink href={CODE_DISTRIBUTION_URL} external>
                    Trang phát code
                  </InfoLink>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[13px] font-bold text-[#F0D78C]">Theo dõi thêm:</span>
                  <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    <img
                      src="/images/icons/icon7.png"
                      alt=""
                      width={22}
                      height={22}
                      className="size-[22px] rounded-full"
                    />
                  </a>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    <img
                      src="/images/icons/icon8.png"
                      alt=""
                      width={22}
                      height={22}
                      className="size-[22px] rounded-full"
                    />
                  </a>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Toaster position="top-center" richColors />
    </>
  )
}

function Field({
  id,
  label,
  placeholder,
  value,
  error,
  className,
  onChange,
}: {
  id: string
  label: string
  placeholder: string
  value: string
  error?: string
  className?: string
  onChange: (value: string) => void
}) {
  return (
    <div className={className}>
      <input
        id={id}
        aria-label={label}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
        className={`h-10 w-full rounded-full bg-white px-4 text-center text-[16px] text-[#333] outline-none placeholder:text-[14px] placeholder:text-[#8FB4D0] focus:ring-2 focus:ring-[#E8C547]/80 ${
          error ? 'ring-2 ring-[#FFB4A8]' : ''
        }`}
      />
      {error ? <p className="mt-1 text-center text-[11px] text-[#FFD0A8]">{error}</p> : null}
    </div>
  )
}

function InfoLink({
  href,
  children,
  external,
}: {
  href: string
  children: ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="inline-flex items-center gap-1 text-[12px] font-normal text-[#F0D78C] underline decoration-[#F0D78C] underline-offset-2 hover:text-[#ffe08a]"
    >
      {children}
      <img src="/images/icons/icon6.png" alt="" width={14} height={14} className="size-3.5 shrink-0" />
    </a>
  )
}

/** Widget Turnstile cố định 300×65; khung hẹp hơn thì scale nhỏ lại thay vì bị cắt. */
function ScaledTurnstile({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const updateScale = (width: number) => {
      if (width <= 0) return
      setScale(Math.min(1, Math.max(0, width - 4) / TURNSTILE_WIDTH))
    }

    updateScale(el.getBoundingClientRect().width)
    const observer = new ResizeObserver((entries) => {
      updateScale(entries[0]?.contentRect.width ?? 0)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="relative w-full min-w-0">
      <div style={{ height: Math.ceil(TURNSTILE_HEIGHT * scale) }} />
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: TURNSTILE_WIDTH,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <div className="h-[65px] w-[300px]">{children}</div>
      </div>
    </div>
  )
}

export default App
