export interface ISignInRequest {
  email: string;
  password: string;
}

export interface ISignInResponse {
  message: string;
  data: {
    name: string
  }
}