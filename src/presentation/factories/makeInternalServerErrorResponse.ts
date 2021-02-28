import { HttpResponse } from 'src/core/HttpResponse'

export const makeInternalServerErrorRequest = <E = unknown>(error: E): HttpResponse<{ error: E }> => ({
  statusCode: 500,
  body: {
    error,
  },
})
