export type Result<T, U> = {
  data: T | undefined
  error: U | undefined
}

export const loading = {
  data: undefined,
  error: undefined,
}

export function succeeded<T> (data: T): Result<T, undefined> {
  return { data, error: undefined }
}

export function failed<T> (error: T): Result<undefined, T> {
  return { data: undefined, error }
}
