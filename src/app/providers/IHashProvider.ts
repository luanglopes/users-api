export interface IHashProvider {
  encrypt(raw: string): Promise<string>
}
