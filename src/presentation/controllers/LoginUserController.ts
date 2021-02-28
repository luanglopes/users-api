import { ILoginUser, LoginUserDTO } from 'src/app/useCases/LoginUser/ILoginUser'
import { HttpRequest } from 'src/core/HttpRequest'
import { HttpResponse } from 'src/core/HttpResponse'
import { IController } from 'src/core/IController'
import { Result, ResultType } from 'src/core/Result'
import { MissingBodyParamError } from '../errors/MissingBodyParamError'
import { ValidationError } from '../errors/ValidationError'
import { makeBadRequestResponse } from '../factories/makeBadRequestResponse'
import { makeInternalServerErrorRequest } from '../factories/makeInternalServerErrorResponse'
import { makeOkResponse } from '../factories/makeOkResponse'

export class LoginUserController implements IController {
  constructor(private loginUser: ILoginUser) {}

  private validateRequestBody(body: LoginUserDTO): ResultType<ValidationError, null> {
    const requiredFields: (keyof LoginUserDTO)[] = ['email', 'password']
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

  async handle({ body }: HttpRequest<LoginUserDTO>): Promise<HttpResponse> {
    const bodyValidationResult = this.validateRequestBody(body)

    if (bodyValidationResult.isFail()) {
      return makeBadRequestResponse(bodyValidationResult.value)
    }

    try {
      const result = await this.loginUser.execute(body)

      if (result.isFail()) {
        return makeBadRequestResponse(result.value)
      }

      return makeOkResponse(result.value)
    } catch (error) {
      return makeInternalServerErrorRequest(error)
    }
  }
}
