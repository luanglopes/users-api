import { HttpResponse } from 'src/core/HttpResponse'

export const makeBadRequestResponse = <E = unknown>(error: E): HttpResponse<{ error: E }> => ({
  statusCode: 400,
  body: {
    error,
  },
})
