export interface IUser {
  email: string
  pass: string
}

interface Infos {
  [propsName: string]: any
}
export interface IUserState {
  token: string
  infos: Infos
}