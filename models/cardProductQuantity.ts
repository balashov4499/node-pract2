import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    OneToOne,
    JoinColumn, ManyToMany, ManyToOne
} from "typeorm";
import {User} from './user';
import {Product} from './product';
import {Card} from './card';


@Entity()
export class CardProductQuantity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false})
    productId: number;

    @Column({ type: 'int', nullable: false, default: 0})
    quantity: number;

    @ManyToOne(type => Card, card => card.cpq)
    card: Card;

}
