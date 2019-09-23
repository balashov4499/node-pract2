import {
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToOne,
    OneToMany
} from "typeorm";
import {User} from './user';
import {CardProductQuantity} from './cardProductQuantity';


@Entity()
export class Card extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => User, user => user.card)
    user: User;

    @OneToMany(type => CardProductQuantity, cpq => cpq.card, {cascade: true, eager: true})
    cpq: CardProductQuantity[];

}
