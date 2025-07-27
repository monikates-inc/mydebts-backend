import * as bcrypt from 'bcrypt';

interface SeedUser {
    email: string;
    name: string;
    lastname: string;
    password: string;
}
interface SeedDebt {
    name: string,
    lastname: string,
    phone?: string,
    email?: string,
    userEmail: string;
    mount: number;
    description?: string;
}




interface SeedData {
    users: SeedUser[];
    debts: SeedDebt[];
}



export const initialData: SeedData = {
    users: [
        {
            email: 'seba.naranjo@gmail.com',
            name: 'Sebastián',
            lastname: 'Naranjo',
            password: bcrypt.hashSync('Abc123456', 10),
        },
        {
            email: 'enzo.troncoso@gmail.com',
            name: 'Enzo',
            lastname: 'Troncoso',
            password: bcrypt.hashSync('Abc123456', 10),
        },
        {
            email: 'diego.cisterna@gmail.com',
            name: 'Diego',
            lastname: 'Cisterna',
            password: bcrypt.hashSync('Abc123456', 10),
        },
    ],
    debts: [
        {
            name: "Ernesto",
            lastname: "Medina",
            phone: "+56987654321",
            email: "ernesto.medina@example.com",
            userEmail: 'seba.naranjo@gmail.com',
            mount: 1000,
            description: "Deuda por servicios prestados",
        },

        // {
        //     name: "Ernesto",
        //     lastname: "Medina",
        //     phone: "+56987654321",
        //     email: "ernesto.medina@example.com",
        //     userEmail: 'seba.naranjo@gmail.com',
        //     mount: 1000,
        //     description: "Deuda",
        // },

        {
            name: "Manuel",
            lastname: "Solis",
            userEmail: 'seba.naranjo@gmail.com',
            mount: 500,
        },
        {
            name: "Manuel",
            lastname: "Luque",
            phone: "+56912345678",
            userEmail: 'seba.naranjo@gmail.com',
            mount: 750,
        },
        {
            name: "Pablo",
            lastname: "Salvo",
            userEmail: 'enzo.troncoso@gmail.com',
            mount: 300,
        },
    ],   
}