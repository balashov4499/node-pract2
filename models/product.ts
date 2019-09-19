import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable} from "typeorm";
import {Category} from './category';

@Entity()
export class Product extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: false, length: 255, unique: true})
    name: string;

    @Column({type: 'varchar', length: 255,})
    description: string;

    @ManyToMany(type => Category, category => category.products,
        {cascade: true, eager: true})
    @JoinTable()
    categories: Category[];

}
