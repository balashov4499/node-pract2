import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    OneToOne,
    JoinColumn
} from "typeorm";
import bcrypt from 'bcryptjs';
import {Card} from './card';

export enum UserRole {
    ADMIN = "admin",
    CUSTOMER = "customer"
}

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: false, length: 255, unique: true})
    email: string;

    @Column({type: 'varchar', nullable: false, length: 255})
    password: string;

    @Column({type: 'varchar', nullable: false, length: 255})
    firstName: string;

    @Column({type: 'varchar', nullable: false, length: 255})
    lastName: string;

    @Column({type: 'text', nullable: true})
    token: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CUSTOMER
    })
    role: UserRole;

    @OneToOne(type => Card, card => card.user, {cascade: true, eager:true}) // specify inverse side as a second parameter
    @JoinColumn()
    card: Card;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPasswordBeforeInsert() {
        this.password = await bcrypt.hash(this.password, 8);
    }

    static async findByCredentials(email, password): Promise<User> {
        const user = await User.findOne({email});
        if (!user) throw new Error('unable to login');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('unable to login');
        return user;
    }


}
