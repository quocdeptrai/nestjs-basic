import {
  Contains,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  name: string;
  address: string;
  phone: string;

  // @IsEmpty()
  // @IsNumber()
  // @Min(0)
  age: number;
}
