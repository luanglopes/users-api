import { IUpdateUser, UpdateUserDTO } from 'src/app/useCases/UpdateUser/IUpdateUser'
import { HttpRequest } from 'src/core/HttpRequest'
import { HttpResponse } from 'src/core/HttpResponse'
import { IController } from 'src/core/IController'
import { Result, ResultType } from 'src/core/Result'
import { InvalidParamTypeError } from '../errors/InvalidParamTypeError'
import { MissingBodyParamError } from '../errors/MissingBodyParamError'
import { ValidationError } from '../errors/ValidationError'
import { makeBadRequestResponse } from '../factories/makeBadRequestResponse'
import { makeInternalServerErrorRequest } from '../factories/makeInternalServerErrorResponse'
import { makeOkResponse } from '../factories/makeOkResponse'

interface IParams {
  id: string
}

export class UpdateUserController implements IController {
  constructor(private updateUser: IUpdateUser) {}

  private validateRequestBody(body: UpdateUserDTO): ResultType<ValidationError, null> {
    const requiredFields: (keyof UpdateUserDTO)[] = ['name', 'email', 'roleKey']
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

  private validateRequestParams(params: IParams): ResultType<ValidationError, null> {
    const { id } = params

    if (!/^[0-9]*$/.test(id)) {
      return Result.fail(new ValidationError({ id: new InvalidParamTypeError('id', ['number']) }))
    }

    return Result.success(null)
  }

  async handle({ body, params }: HttpRequest<UpdateUserDTO, unknown, IParams>): Promise<HttpResponse> {
    const bodyValidationResult = this.validateRequestBody(body)
    const paramsValidationResult = this.validateRequestParams(params)

    if (bodyValidationResult.isFail()) {
      return makeBadRequestResponse(bodyValidationResult.value)
    }

    if (paramsValidationResult.isFail()) {
      return makeBadRequestResponse(paramsValidationResult.value)
    }

    const { id } = params

    try {
      const result = await this.updateUser.execute(Number(id), body)

      if (result.isFail()) {
        return makeBadRequestResponse(result.value)
      }

      return makeOkResponse(result.value)
    } catch (error) {
      return makeInternalServerErrorRequest(error)
    }
  }
}
