export type AccountPrizeConfig = {
  accountId: string
  amount: number
}

export const DEFAULT_PRIZE_OPTIONS = [
  38, 68, 88, 138, 168, 188, 238, 268, 288, 338, 368, 388, 438, 468, 488, 538, 568, 588, 638,
  668, 688, 738, 768, 788, 838, 868, 888,
]

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
