import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, BeforeUpdate} from "typeorm";
import bcrypt from 'bcryptjs';

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

    @BeforeInsert()
    @BeforeUpdate()
    async hashPasswordBeforeInsert() {
        this.password = await bcrypt.hash(this.password, 8);
    }

}
