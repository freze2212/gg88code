import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { AccountPrizeConfig } from '../lib/prizeConfig'
import {
  loadAdminPassword,
  loadAdminUsername,
  loadPrizeConfigs,
  normalizeAccountId,
  savePrizeConfigs,
} from '../lib/prizeConfig'

function AdminPage() {
  const [adminUsername] = useState(() => loadAdminUsername())
  const [adminPassword] = useState(() => loadAdminPassword())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [configs, setConfigs] = useState<AccountPrizeConfig[]>(() => loadPrizeConfigs())
  const [accountId, setAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const sortedConfigs = useMemo(() => {
    return [...configs].sort((left, right) => left.accountId.localeCompare(right.accountId))
  }, [configs])

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (loginUsername.trim() !== adminUsername || loginPassword !== adminPassword) {
      setMessage('Tài khoản hoặc mật khẩu admin không đúng.')
      return
    }

    setIsAuthenticated(true)
    setLoginUsername('')
    setLoginPassword('')
    setMessage('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedAccountId = normalizeAccountId(accountId)
    const parsedAmount = Number(amount)

    if (!normalizedAccountId) {
      setMessage('Vui lòng nhập tài khoản.')
      return
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setMessage('Vui lòng nhập số tiền hợp lệ.')
      return
    }

    const nextConfigs = [...configs]
    const existingIndex = nextConfigs.findIndex((item) => item.accountId === normalizedAccountId)
    const nextItem = { accountId: normalizedAccountId, amount: Math.floor(parsedAmount) }

    if (existingIndex >= 0) {
      nextConfigs[existingIndex] = nextItem
    } else {
      nextConfigs.push(nextItem)
    }

    savePrizeConfigs(nextConfigs)
    setConfigs(nextConfigs)
    setAccountId('')
    setAmount('')
    setMessage(`Đã lưu cấu hình cho tài khoản ${normalizedAccountId}.`)
  }

  const handleDelete = (targetAccountId: string) => {
    const nextConfigs = configs.filter((item) => item.accountId !== targetAccountId)
    savePrizeConfigs(nextConfigs)
    setConfigs(nextConfigs)
    setMessage(`Đã xóa cấu hình của tài khoản ${targetAccountId}.`)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#e8fff6_0%,#bff4ef_45%,#8bd8db_100%)] px-4 py-8 text-[#082047]">
        <div className="mx-auto w-full max-w-xl rounded-[28px] bg-white/90 p-6 shadow-[0_18px_50px_rgba(8,32,71,0.18)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0ea5a0]">
            Admin Login
          </p>
          <h1 className="mt-2 text-3xl font-black text-[#0a365f]">Đăng nhập admin</h1>
          <p className="mt-2 text-sm text-[#40607c]">
            Dùng tài khoản mặc định `admin` và mật khẩu `Admin123!`.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#0a365f]">Tài khoản</span>
              <input
                type="text"
                value={loginUsername}
                onChange={(event) => setLoginUsername(event.target.value)}
                className="w-full rounded-2xl border border-[#a7ddd8] bg-[#f7fffd] px-4 py-3 outline-none transition focus:border-[#0ea5a0]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#0a365f]">Mật khẩu</span>
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                className="w-full rounded-2xl border border-[#a7ddd8] bg-[#f7fffd] px-4 py-3 outline-none transition focus:border-[#0ea5a0]"
              />
            </label>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0ea5a0] px-5 text-sm font-semibold text-white transition hover:bg-[#0b8a86]"
            >
              Vào trang admin
            </button>
          </form>

          {message ? <p className="mt-4 text-sm text-[#0a365f]">{message}</p> : null}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#e8fff6_0%,#bff4ef_45%,#8bd8db_100%)] px-4 py-8 text-[#082047]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-[28px] bg-white/90 p-6 shadow-[0_18px_50px_rgba(8,32,71,0.18)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0ea5a0]">
              Admin Prize Config
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#0a365f]">Cấu hình thưởng theo tài khoản</h1>
          </div>
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#0ea5a0] px-5 text-sm font-semibold text-white transition hover:bg-[#0b8a86]"
          >
            Về trang nhận code
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-6">
            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] bg-white/90 p-6 shadow-[0_18px_50px_rgba(8,32,71,0.18)]"
            >
              <h2 className="text-xl font-bold text-[#0a365f]">Thêm hoặc cập nhật</h2>
              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#0a365f]">Tài khoản</span>
                  <input
                    type="text"
                    value={accountId}
                    onChange={(event) => setAccountId(event.target.value)}
                    placeholder="Ví dụ: admin1"
                    className="w-full rounded-2xl border border-[#a7ddd8] bg-[#f7fffd] px-4 py-3 outline-none transition focus:border-[#0ea5a0]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#0a365f]">
                    Số tiền nhận (K)
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Ví dụ: 888"
                    className="w-full rounded-2xl border border-[#a7ddd8] bg-[#f7fffd] px-4 py-3 outline-none transition focus:border-[#0ea5a0]"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0ea5a0] px-5 text-sm font-semibold text-white transition hover:bg-[#0b8a86]"
                >
                  Lưu cấu hình
                </button>

                {message ? <p className="text-sm text-[#0a365f]">{message}</p> : null}
              </div>
            </form>
          </div>

          <div className="rounded-[28px] bg-white/90 p-6 shadow-[0_18px_50px_rgba(8,32,71,0.18)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-[#0a365f]">Danh sách cấu hình</h2>
              <span className="rounded-full bg-[#e6fffb] px-3 py-1 text-xs font-semibold text-[#0ea5a0]">
                {sortedConfigs.length} tài khoản
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {sortedConfigs.length ? (
                sortedConfigs.map((item) => (
                  <div
                    key={item.accountId}
                    className="flex flex-col gap-3 rounded-2xl border border-[#d8efeb] bg-[#fafffe] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-sm text-[#65809a]">Tài khoản</p>
                      <p className="text-lg font-bold text-[#0a365f]">{item.accountId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#65809a]">Tiền nhận</p>
                      <p className="text-lg font-bold text-[#ef6c00]">{item.amount}K</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.accountId)}
                      className="inline-flex h-10 items-center justify-center rounded-full bg-[#ffe7e1] px-4 text-sm font-semibold text-[#d14f2c] transition hover:bg-[#ffd6cc]"
                    >
                      Xóa
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#c8e6e2] bg-[#fbfffe] p-6 text-sm text-[#65809a]">
                  Chưa có cấu hình nào. Tài khoản không có trong danh sách sẽ random thưởng mặc định.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
