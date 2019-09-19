import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, ManyToMany} from "typeorm";
import {Product} from './product';

@Entity()
export class Category extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: false, length: 255, unique: true})
    name: string;

    @Column({type: 'varchar', length: 255, default: ''})
    description: string;

    @ManyToOne(type => Category, category => category.childCategories)
    parentCategory: Category;

    @OneToMany(type => Category, category => category.parentCategory, {
        cascade: true
    } )
    childCategories: Category[];

    // @ManyToMany(type => Product, product => product.categories, {
    //     cascade: true,
    // })
    // products: Product[];
}
