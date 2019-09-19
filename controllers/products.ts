import {Category} from '../models/category';
import {DeleteResult} from 'typeorm';
import wrapAsync from '../middleware/requestFunctionsWrapper';
import auth from '../middleware/auth';
import {User, UserRole} from '../models/user';
import {validateCategory} from '../middleware/categoryDataValidator';
import {Product} from '../models/product';

const express = require('express');
const router = new express.Router();

// router.get('/products/:id', async (req, res) => {
//     const selectedCategory = req.params.id;
//     const category = await Category.createQueryBuilder('category')
//         .where("category.id = :id", {id: selectedCategory})
//         .leftJoinAndSelect('category.childCategories', 'subCategory')
//         .getMany();
//     return res.send(category);
// });

router.post('/products/:category', wrapAsync(async function (req, res) {


    const product = new Product();
    product.name = req.body.name;
    product.description = req.body.description;

    // if (req.body.parentCategory) {
    //     const parentCategory: Category = await Category.findOne({name: req.body.parentCategory});
    //     if (parentCategory) {
    //         category.parentCategory = parentCategory;
    //     } else {
    //         return res.status(400).send({Error: 'Not existing parent category is provided'})
    //     }
    // }
    // await category.save();
    // return res.status(201).send(category);
}));

// router.put('/categories/:id', validateCategory, wrapAsync(async function (req, res) {
//     const categoryToRemoveId = req.params.id;
//     const category: Category = await Category.createQueryBuilder('category')
//         .where("category.id = :id", {id: categoryToRemoveId})
//         .getOne();
//
//     if (!category) return res.status(404).send({error: 'No category with provided id'});
//
//     const keysToUpdate = Object.keys(req.body);
//     keysToUpdate.forEach((key) => category[key] = req.body[key]);
//     const updated = await Category.save(category);
//     res.status(200).send(updated)
//
// }));
//
// router.delete('/categories/:id', async (req, res) => {
//     const categoryToRemoveId = req.params.id;
//     const category: Category = await Category.createQueryBuilder('category')
//         .where("category.id = :id", {id: categoryToRemoveId})
//         .getOne();
//     if (!category) {
//         return res.status(404).send({error: 'No category with provided id'});
//     }
//     if (category.childCategories && category.childCategories.length > 0) {
//         return res.status(400).send({error: 'Please remove child categories first'});
//     }
//     const result: DeleteResult = await Category.delete(req.params.id);
//     res.status(200).send();
// });


export default router;
