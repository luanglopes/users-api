import { IncomingHttpHeaders } from 'http'

export type HttpRequest<B = unknown, Q = unknown> = {
  body: B
  query: Q
  headers: IncomingHttpHeaders
}
