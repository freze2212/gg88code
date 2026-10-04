export type AccountPrizeConfig = {
  accountId: string
  amount: number
}

export const DEFAULT_PRIZE_OPTIONS = [
  38, 68, 88, 138, 168, 188, 238, 268, 288, 338, 368, 388, 438, 468, 488, 538, 568, 588, 638,
  668, 688, 738, 768, 788, 838, 868, 888,
]

const DEFAULT_RANDOM_PRIZE_MIN_K = 88
const DEFAULT_RANDOM_PRIZE_MAX_K = 888
const DEFAULT_RANDOM_PRIZE_TAILS = [18, 38, 58, 68, 88] as const

export function getRandomPrizeK(
  options: { minK?: number; maxK?: number; tails?: readonly number[] } = {},
) {
  const minK = Math.floor(options.minK ?? DEFAULT_RANDOM_PRIZE_MIN_K)
  const maxK = Math.floor(options.maxK ?? DEFAULT_RANDOM_PRIZE_MAX_K)
  const tails = options.tails?.length ? options.tails : DEFAULT_RANDOM_PRIZE_TAILS

  const low = Math.min(minK, maxK)
  const high = Math.max(minK, maxK)

  const maxBase = Math.floor(high / 100) + 1
  const candidates: number[] = []

  for (let base = 0; base <= maxBase; base += 1) {
    for (const tail of tails) {
      const value = base * 100 + Math.floor(tail)
      if (value >= low && value <= high) {
        candidates.push(value)
      }
    }
  }

  if (!candidates.length) {
    return low
  }

  return candidates[Math.floor(Math.random() * candidates.length)]
}

const STORAGE_KEY = 'gg88-admin-prize-config'
const ADMIN_USERNAME_KEY = 'gg88-admin-username'
const ADMIN_PASSWORD_KEY = 'gg88-admin-password'
const DEFAULT_ADMIN_USERNAME = 'admin'
const DEFAULT_ADMIN_PASSWORD = 'Admin123!'

export function normalizeAccountId(accountId: string) {
  return accountId.trim().toLowerCase()
}

export function loadPrizeConfigs(): AccountPrizeConfig[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)
    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue) as unknown
    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue
      .filter((item): item is AccountPrizeConfig => {
        return (
          typeof item === 'object' &&
          item !== null &&
          typeof item.accountId === 'string' &&
          typeof item.amount === 'number' &&
          Number.isFinite(item.amount)
        )
      })
      .map((item) => ({
        accountId: normalizeAccountId(item.accountId),
        amount: Math.floor(item.amount),
      }))
  } catch {
    return []
  }
}

export function savePrizeConfigs(configs: AccountPrizeConfig[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
}

export function getConfiguredPrize(accountId: string) {
  const normalizedAccountId = normalizeAccountId(accountId)
  if (!normalizedAccountId) {
    return null
  }

  const matchingConfig = loadPrizeConfigs().find((item) => item.accountId === normalizedAccountId)
  return matchingConfig?.amount ?? null
}

export function loadAdminPassword() {
  if (typeof window === 'undefined') {
    return DEFAULT_ADMIN_PASSWORD
  }

  return window.localStorage.getItem(ADMIN_PASSWORD_KEY) ?? DEFAULT_ADMIN_PASSWORD
}

export function loadAdminUsername() {
  if (typeof window === 'undefined') {
    return DEFAULT_ADMIN_USERNAME
  }

  return window.localStorage.getItem(ADMIN_USERNAME_KEY) ?? DEFAULT_ADMIN_USERNAME
}

export function saveAdminUsername(username: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ADMIN_USERNAME_KEY, username)
}

export function saveAdminPassword(password: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ADMIN_PASSWORD_KEY, password)
}
