import { TokenPayload } from 'src/app/contracts/TokenPayload'

export interface ITokenProvider {
  generate(payload: TokenPayload): Promise<string>
}
