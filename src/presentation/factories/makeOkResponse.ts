import { HttpResponse } from 'src/core/HttpResponse'

export const makeOkResponse = <B = unknown>(body: B): HttpResponse<B> => ({
  statusCode: 200,
  body,
})
