import { toast } from 'sonner'
import { liveSiteUrl } from '../lib/liveSite'

type NavItem = {
  href?: string
  icon: string
  label: string
  width: number
  height: number
}

const NAV_ITEMS = {
  home: { href: liveSiteUrl('/'), icon: '/images/icons/icon2.png', label: 'Trang chủ', width: 29, height: 29 },
  enterCode: { icon: '/images/icons/icon3.png', label: 'Nhập code', width: 29, height: 29 },
  live: { href: liveSiteUrl('/lives'), icon: '/images/icons/icon4.png', label: 'Live', width: 36, height: 28 },
  profile: { href: liveSiteUrl('/profile'), icon: '/images/icons/icon5.png', label: 'Tài khoản', width: 29, height: 29 },
} satisfies Record<string, NavItem>

type FooterProps = {
  onEnterCodeClick: () => void
}

function Footer({ onEnterCodeClick }: FooterProps) {
  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-50">
      <nav
        className="pointer-events-auto relative grid grid-cols-5 items-center rounded-t-[40px] shadow-[0_0_32px_rgba(0,0,0,0.1)]"
        style={{
          height: 'calc(50px + env(safe-area-inset-bottom))',
          backgroundImage: 'linear-gradient(171deg, #178F80 6.79%, #25C4AF 89.92%)',
        }}
      >
        <NavIcon item={NAV_ITEMS.home} />
        <NavIcon item={NAV_ITEMS.enterCode} active onClick={onEnterCodeClick} />
        <CenterLogo />
        <NavIcon item={NAV_ITEMS.live} />
        <NavIcon item={NAV_ITEMS.profile} />
      </nav>
    </footer>
  )
}

function NavIcon({
  item,
  active,
  onClick,
}: {
  item: NavItem
  active?: boolean
  onClick?: () => void
}) {
  const icon = (
    <img
      src={item.icon}
      alt=""
      width={item.width}
      height={item.height}
      className={`h-6 w-6 object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] transition-[filter,transform] duration-200 hover:brightness-110 hover:drop-shadow-[0_2px_8px_rgba(0,222,211,0.55)] ${
        active ? 'footer-nav-icon-active' : ''
      }`}
    />
  )

  if (!item.href) {
    return (
      <button
        type="button"
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        onClick={onClick}
        className="flex h-full w-full cursor-pointer items-center justify-center pb-[env(safe-area-inset-bottom)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
      >
        {icon}
      </button>
    )
  }

  return (
    <a
      href={item.href}
      aria-label={item.label}
      className="relative flex h-full items-center justify-center pb-[env(safe-area-inset-bottom)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
    >
      {icon}
    </a>
  )
}

function CenterLogo() {
  return (
    <button
      type="button"
      aria-label="Tải App"
      onClick={() => toast.info('Tính năng đang phát triển')}
      className="relative flex h-full w-full cursor-pointer items-center justify-center border-0 bg-transparent p-0 pb-[env(safe-area-inset-bottom)] transition-transform duration-200 hover:-translate-y-1 active:scale-95"
    >
      <span className="footer-center-logo absolute left-1/2 top-0 z-10 flex w-16 -translate-x-1/2 translate-y-[-30%] items-center justify-center max-sm:w-14">
        <img src="/images/polygon3.png" alt="" width={109} height={117} className="h-auto w-full" />
      </span>
    </button>
  )
}

export default Footer
