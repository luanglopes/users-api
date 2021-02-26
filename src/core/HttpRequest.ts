import { IncomingHttpHeaders } from 'http'

export type HttpRequest<B = unknown, Q = unknown, P = unknown> = {
  body: B
  query: Q
  params: P
  headers: IncomingHttpHeaders
}
