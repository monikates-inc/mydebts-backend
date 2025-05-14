import { IsEmail, IsInt, IsOptional, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    
    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
    })
    password: string;

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @MinLength(1)
    lastname: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    budget?: number;
}
