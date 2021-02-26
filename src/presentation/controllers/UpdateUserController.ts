import { IUpdateUser, UpdateUserDTO } from 'src/app/useCases/UpdateUser/IUpdateUser'
import { HttpRequest } from 'src/core/HttpRequest'
import { HttpResponse } from 'src/core/HttpResponse'
import { IController } from 'src/core/IController'
import { Result, ResultType } from 'src/core/Result'
import { InvalidParamTypeError } from '../errors/InvalidParamTypeError'
import { MissingBodyParamError } from '../errors/MissingBodyParamError'
import { ValidationError } from '../errors/ValidationError'

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
      return {
        statusCode: 400,
        body: {
          error: bodyValidationResult.value,
        },
      }
    }

    if (paramsValidationResult.isFail()) {
      return {
        statusCode: 400,
        body: {
          error: paramsValidationResult.value,
        },
      }
    }

    const { id } = params

    try {
      const result = await this.updateUser.execute(Number(id), body)

      if (result.isFail()) {
        return {
          statusCode: 400,
          body: {
            error: result.value,
          },
        }
      }

      return {
        statusCode: 201,
        body: result.value,
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: {
          error,
        },
      }
    }
  }
}
