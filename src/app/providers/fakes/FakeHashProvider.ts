import { IHashProvider } from 'src/app/providers/IHashProvider'

export class FakeHashProvider implements IHashProvider {
  async encrypt(raw: string): Promise<string> {
    return raw
  }
}
