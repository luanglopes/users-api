import { CreateUserDTO, ICreateUser } from 'src/app/useCases/CreateUser/ICreateUser'
import { HttpRequest } from 'src/core/HttpRequest'
import { HttpResponse } from 'src/core/HttpResponse'
import { IController } from 'src/core/IController'
import { Result, ResultType } from 'src/core/Result'
import { MissingBodyParamError } from '../errors/MissingBodyParamError'
import { ValidationError } from '../errors/ValidationError'

export class CreateUserController implements IController {
  constructor(private createUser: ICreateUser) {}

  private validateRequestBody(body: CreateUserDTO): ResultType<ValidationError, null> {
    const requiredFields: (keyof CreateUserDTO)[] = ['name', 'email', 'password', 'role']
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
      return {
        statusCode: 400,
        body: {
          error: requestValidationResult.value,
        },
      }
    }

    try {
      const result = await this.createUser.execute(body)

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
