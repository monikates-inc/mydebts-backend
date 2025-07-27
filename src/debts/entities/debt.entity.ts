import { User } from "src/auth/entities/user.entity";
import { Debtor } from "src/debtors/entities/debtor.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'debts'})
export class Debt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'boolean',
        default: false
    })
    paid: boolean;

    @Column({
        type: 'text',
        nullable: true,
        default: null,
    })
    paymentMethod?: string;

    @Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    })
    paymentDate?: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @Column({
        type: 'int'
    })
    mount: number;

    @Column('text', {
        nullable: true
    })
    description?: string;

    @ManyToOne(
        () => Debtor, 
        (debtor) => debtor.id,
        { nullable: false, onDelete: 'CASCADE' } // Asegura que al eliminar un deudor, se eliminen sus deudas
    ) 
    debtor: Debtor;

    @ManyToOne(
        () => User, 
        (user) => user.id,
        { nullable: true } 
    ) 
    user: User;
}
