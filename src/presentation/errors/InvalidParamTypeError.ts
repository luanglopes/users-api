export class InvalidParamTypeError extends Error {
  constructor(paramName: string, validTypes: string[]) {
    super()

    this.message = `Param {${paramName}} type should be one of: ${validTypes.join(', ')}`
    this.name = 'InvalidParamTypeError'
  }
}
