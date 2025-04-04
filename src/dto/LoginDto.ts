import {
  IsEmail,
  IsNotEmpty,
  MinLength,
} from "class-validator";

export class LoginDto {
  @IsNotEmpty({
    message: "To pole jest wymagane",
  })
  @IsEmail(
    {},
    {
      message: "Niepoprawny format adresu e-mail",
    }
  )
  email: string;

  @IsNotEmpty({
    message: "To pole jest wymagane",
  })
  @MinLength(8, {
    message: "Wymagane min. 8 znaków",
  })
  pwd: string;
}
