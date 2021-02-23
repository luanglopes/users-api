export class MissingBodyParamError extends Error {
  constructor(paramName: string) {
    super()

    this.message = `Property ${paramName} is required and is missing on request body`
    this.name = 'MissingBodyParamError'
  }
}
