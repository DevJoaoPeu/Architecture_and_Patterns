import { Exclude, Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    surname: string;
 
    @Exclude()
    createdAt?: Date;
  
    @Exclude()
    updatedAt?: Date;
}