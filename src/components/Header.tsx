import { liveSiteUrl } from '../lib/liveSite'

const buttonClass =
  'header-btn relative inline-flex h-[26px] shrink-0 cursor-pointer items-center gap-1 overflow-hidden whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] font-semibold tracking-[-0.4px] text-white transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.96] active:brightness-95 min-[390px]:h-7 min-[390px]:px-3 min-[390px]:text-[14px] min-[420px]:h-[30px] min-[420px]:gap-[1.5px] min-[420px]:px-[15px] min-[420px]:py-[3.75px] min-[420px]:text-base min-[420px]:tracking-[-0.48px]'

const buttonGradientStyle = {
  backgroundImage: 'linear-gradient(137.35deg, #178F80 6.79%, #25C4AF 89.92%)',
}

const buttonTextStyle = { fontFamily: "'Roboto', sans-serif" }

type HeaderProps = {
  onEnterCodeClick: () => void
}

function Header({ onEnterCodeClick }: HeaderProps) {
  return (
    <header className="flex h-11 items-center justify-between gap-1 overflow-hidden px-2 min-[390px]:h-12 min-[390px]:gap-1.5 min-[420px]:h-[53px] min-[420px]:gap-2">
      <div className="flex min-w-0 flex-1">
        <button
          type="button"
          onClick={onEnterCodeClick}
          className="inline-flex shrink-0"
          aria-label="Nhập Code"
        >
          <img
            src="/images/buttons/button20.png"
            alt=""
            width={360}
            height={90}
            className="h-7 w-auto object-contain min-[420px]:h-8"
          />
        </button>
      </div>

      <img
        src="/images/logos/logo1.png"
        alt="GG88"
        width={129}
        height={38}
        className="h-7 w-auto shrink-0 object-contain min-[390px]:h-8 min-[420px]:h-[38px]"
      />

      <div className="flex min-w-0 flex-1 justify-end">
        <a href={liveSiteUrl('/dang-nhap')} className={buttonClass} style={buttonGradientStyle}>
          <span className="relative z-10" style={buttonTextStyle}>
            Đăng Nhập
          </span>
        </a>
      </div>
    </header>
  )
}

export default Header
