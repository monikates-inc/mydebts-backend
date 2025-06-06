import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsOptional, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    

    @ApiProperty({
        description: 'Email del usuario (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @IsEmail()
    email: string;
    
    @ApiProperty({
        description: 'Password del usuario',
        nullable: false,
        minLength: 1,       
    })
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
    })
    password: string;

    @ApiProperty({
        description: 'Nombre del usuario',
        nullable: false,
        minLength: 1,       
    })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        description: 'Apellido del usuario',
        nullable: false,
        minLength: 1,       
    })
    @IsString()
    @MinLength(1)
    lastname: string;

    @ApiProperty({
        description: 'Presupuesto del usuario',
        nullable: true,      
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    budget?: number;
}
