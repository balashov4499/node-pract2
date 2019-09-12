import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false, length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: false, length: 255 })
    password: string;

    @Column({ type: 'varchar', nullable: false, length: 255 })
    firstName: string;

    @Column({ type: 'varchar', nullable: false, length: 255 })
    lastName: string;

}
