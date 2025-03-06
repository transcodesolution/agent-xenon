export interface ISignInRequest {
  name: string;
  email: string;
  password: string;
  candidateToken?: string;
  redirectUrl?: string
}

export interface ISignInResponse {
  status: number,
  message: string,
  data: {
    userType: string,
    firstName: string,
    lastName: string,
    _id: string,
    email: string,
    token: string
  }
}