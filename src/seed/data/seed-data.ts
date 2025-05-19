import * as bcrypt from 'bcrypt';

interface SeedUser {
    email: string;
    name: string;
    lastname: string;
    password: string;
}

interface SeedData {
    users: SeedUser[];
}

export const initialData: SeedData = {
    users: [
        {
            email: 'seba.naranjo@gmail.com',
            name: 'Sebastián',
            lastname: 'Naranjo',
            password: bcrypt.hashSync( 'Abc123456', 10 ),
        },
        {
            email: 'enzo.troncoso@gmail.com',
            name: 'Enzo',
            lastname: 'Troncoso',
            password: bcrypt.hashSync( 'Abc123456', 10 ),
        },        
    ]
}