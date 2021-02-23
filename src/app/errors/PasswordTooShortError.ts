export class PasswordTooShortError extends Error {
  constructor(minPasswordLength: number) {
    super(`Password should have at least ${minPasswordLength} characters`)

    this.name = 'PasswordTooShortError'
  }
}
