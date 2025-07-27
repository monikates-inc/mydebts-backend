import { User } from "src/auth/entities/user.entity";
import { Debt } from "src/debts/entities/debt.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'debtors'})
export class Debtor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    lastname: string;

    @Column('text', {
        nullable: true
    })
    phone: string;

    @Column('text', {
        unique: true,
        nullable: true,
    })
    email: string;

    @ManyToOne(
        () => User,
        ( user ) => user.id,
    )
    user: User;

    @OneToMany(
        () => Debt, 
        debt => debt.debtor,
    )
    debts: Debt[];
}
