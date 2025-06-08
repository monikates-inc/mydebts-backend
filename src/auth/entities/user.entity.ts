import { Debtor } from "src/debtors/entities/debtor.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
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

    @OneToMany(() => Debtor, debtor => debtor.user)
    debtors: Debtor[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }
}
