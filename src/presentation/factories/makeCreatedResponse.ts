import { HttpResponse } from 'src/core/HttpResponse'

export const makeCreatedResponse = <B>(body: B): HttpResponse<B> => ({
  statusCode: 201,
  body,
})
