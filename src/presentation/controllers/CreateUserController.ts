import { CreateUserDTO, ICreateUser } from 'src/app/useCases/CreateUser/ICreateUser'
import { HttpRequest } from 'src/core/HttpRequest'
import { HttpResponse } from 'src/core/HttpResponse'
import { IController } from 'src/core/IController'
import { Result, ResultType } from 'src/core/Result'
import { MissingBodyParamError } from '../errors/MissingBodyParamError'
import { ValidationError } from '../errors/ValidationError'
import { makeBadRequestResponse } from '../factories/makeBadRequestResponse'
import { makeCreatedResponse } from '../factories/makeCreatedResponse'
import { makeInternalServerErrorRequest } from '../factories/makeInternalServerErrorResponse'

export class CreateUserController implements IController {
  constructor(private createUser: ICreateUser) {}

  private validateRequestBody(body: CreateUserDTO): ResultType<ValidationError, null> {
    const requiredFields: (keyof CreateUserDTO)[] = ['name', 'email', 'password', 'roleKey']
    const errors: Record<string, MissingBodyParamError> = {}

    requiredFields.forEach((field) => {
      if (!body[field]) {
        errors[field] = new MissingBodyParamError(field)
      }
    })

    if (Object.keys(errors).length > 0) {
      return Result.fail(new ValidationError(errors))
    }

    return Result.success(null)
  }

  async handle({ body }: HttpRequest<CreateUserDTO>): Promise<HttpResponse> {
    const requestValidationResult = this.validateRequestBody(body)

    if (requestValidationResult.isFail()) {
      return makeBadRequestResponse(requestValidationResult.value)
    }

    try {
      const result = await this.createUser.execute(body)

      if (result.isFail()) {
        return makeBadRequestResponse(result.value)
      }

      return makeCreatedResponse(result.value)
    } catch (error) {
      return makeInternalServerErrorRequest(error)
    }
  }
}
