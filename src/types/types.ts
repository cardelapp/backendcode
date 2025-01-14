export interface Requestbodytype{
     firstname?: string;
    lastname?: string;
    email?: string;
    gender?: string;
   address?: string;
     phonenumbe?: string;
    password?: string;
     role?: string;
    companyName?: string;
}
export interface LoginRequestBody{
    email: string;
    password: string;
  };