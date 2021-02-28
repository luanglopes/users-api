export interface IHashProvider {
  encrypt(raw: string): Promise<string>
  compare(raw: string, hash: string): Promise<boolean>
}
