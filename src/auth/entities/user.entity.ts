import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    lastname: string;

    @Column('int', {
        nullable: true,
    })
    budget?: number;
}
