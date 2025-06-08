import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {

    @ApiProperty({
        description: 'Email del usuario (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @IsEmail()
    email: string;
    
    @ApiProperty({
        description: 'Contraseña del usuario, debe tener al menos una mayúscula, una minúscula y un número',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
    })
    password: string;
}