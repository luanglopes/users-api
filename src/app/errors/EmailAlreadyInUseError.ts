export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`Email "${email}" was already taken by another user`)

    this.name = 'EmailAlreadyInUseError'
  }
}
