import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    name: string;

    @Column('text')
    lastname: string;

    @Column('int', {
        nullable: true,
    })
    budget?: number;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }
}
