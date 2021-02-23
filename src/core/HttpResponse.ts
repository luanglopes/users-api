export type HttpResponse<B = unknown> = {
  statusCode: number
  body?: B
}
