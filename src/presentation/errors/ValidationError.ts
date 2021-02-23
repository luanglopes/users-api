export class ValidationError<T = unknown> extends Error {
  constructor(public readonly fields: Record<string, T>) {
    super()

    this.name = 'ValidationError'
  }
}
