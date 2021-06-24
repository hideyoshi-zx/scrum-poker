export type Result<T, U> = {
  data: T | undefined
  error: U | undefined
  isLoading: boolean
}

export const loading = {
  data: undefined,
  error: undefined,
  isLoading: true,
}

export function succeeded<T> (data: T): Result<T, undefined> {
  return { data, error: undefined, isLoading: false }
}

export function failed<T> (error: T): Result<undefined, T> {
  return { data: undefined, error, isLoading: false }
}
