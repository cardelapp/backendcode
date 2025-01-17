import { Request } from "express";
export interface Requestbodytype{
     firstname?: string;
    lastname?: string;
    email?: string;
    gender?: string;
   address?: string;
     phonenumber?: string;
    password?: string;
     role?: string;
    companyName?: string;
}
export interface LoginRequestBody{
    email: string;
    password: string;
  };

  export interface ListingRequestbodytype{
    title?: string;
    description?: string;
    make?: string;
    model?: string;
    year?: string;
    price?: string;
    color?: string;
    mileage?: string;
    role?: string;
}

export interface ListingParamtype{
  dealerId: string;
}


