import { TokenPayload } from 'src/app/contracts/TokenPayload'
import { ITokenProvider } from 'src/app/providers/ITokenProvider'

export class FakeTokenProvider implements ITokenProvider {
  async generate(payload: TokenPayload): Promise<string> {
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }
}
