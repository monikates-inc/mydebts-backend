import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsPositive, IsString, Matches, MinLength } from "class-validator";

export class CreateDebtDto {

    // info del deudor
    @ApiProperty({
        description: 'Nombre del deudor',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        description: 'Apellido del deudor',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    lastname: string;

    @ApiProperty({
        description: 'Email del deudor',
        nullable: true,
        example: 'correo@correo.com'
    })
    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'Teléfono del deudor',
        nullable: true,
        example: '+56212345678'
    })
    @IsString()
    @IsOptional()
    @Matches(/^\+56[2-9]\d{8}$/, {
        message: 'El teléfono debe ser un número chileno válido (ej: +56212345678)'
    })
    phone?: string;   

    //info de la deuda
    @ApiProperty({
        description: 'Monto de la deuda',
        nullable: false,
        minLength: 1
    })
    @IsNumber()
    @IsPositive()
    mount: number;

    @ApiProperty({
        description: 'Descripción de la deuda',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    description?: string;
} 