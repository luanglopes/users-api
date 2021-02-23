import { HttpRequest } from './HttpRequest'
import { HttpResponse } from './HttpResponse'

export interface IController {
  handle(request: HttpRequest): Promise<HttpResponse>
}
