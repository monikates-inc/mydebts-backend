import { IsEmail, IsNumber, IsOptional, IsPositive, IsString, Matches, MinLength } from "class-validator";

export class CreateDebtDto {

    // info del deudor
    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @MinLength(1)
    lastname: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @Matches(/^\+56[2-9]\d{8}$/, {
        message: 'El teléfono debe ser un número chileno válido (ej: +56212345678)'
    })
    phone?: string;   

    //info de la deuda
    @IsNumber()
    @IsPositive()
    mount: number;
} 