export class WrongEmailOrPasswordError extends Error {
  constructor() {
    super('Email or password are wrong')

    this.name = 'WrongEmailOrPasswordError'
  }
}
