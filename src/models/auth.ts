export interface RegisterModel {
  email: string;
  password: string;
  name: string;
  image: string;
  address: string;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface ResetModel {
  email: string;
  newPassword: string;
}
