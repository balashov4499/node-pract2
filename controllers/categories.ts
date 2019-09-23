import {Category} from '../models/category';
import {DeleteResult} from 'typeorm';
import wrapAsync from '../middleware/requestFunctionsWrapper';
import auth from '../middleware/auth';
import {validateCategory} from '../middleware/validators/categoryDataValidator';
import {Product} from '../models/product';
import {validateNewProduct} from '../middleware/validators/productDataValidator';
import {isAdmin} from '../middleware/validators/userDataValidator';

const express = require('express');
const router = new express.Router();

router.get('/categories',async (req, res) => {
    let allCategories = await Category.createQueryBuilder('category')
        .andWhere('category.parentCategory IS NULL')
        .leftJoinAndSelect('category.childCategories', 'subCategory')
        .getMany();
    return res.send(allCategories);
});

router.get('/categories/:id', async (req, res) => {
    const selectedCategory = req.params.id;
    const category = await Category.createQueryBuilder('category')
        .where("category.id = :id", {id: selectedCategory})
        .leftJoinAndSelect('category.childCategories', 'subCategory')
        .getOne();
    if (!category) return res.status(404).send({error: 'No category with provided id'});
    return res.send(category);
});

router.post('/categories', auth, isAdmin, validateCategory, wrapAsync(async function (req, res) {
    const category = new Category();
    category.name = req.body.name;
    category.description = req.body.description;

    if (req.body.parentCategory) {
        const parentCategory: Category = await Category.findOne({id: req.body.parentCategory});
        if (parentCategory) {
            category.parentCategory = parentCategory;
        } else {
            return res.status(400).send({Error: 'Not existing parent category is provided'})
        }
    }
    await category.save();
    return res.status(201).send(category);
}));

router.put('/categories/:id', auth, isAdmin, validateCategory, wrapAsync(async function (req, res) {
    const categoryToRemoveId = req.params.id;
    const category: Category = await Category.createQueryBuilder('category')
        .where("category.id = :id", {id: categoryToRemoveId})
        .getOne();

    if (!category) return res.status(404).send({error: 'No category with provided id'});

    const keysToUpdate = Object.keys(req.body);
    keysToUpdate.forEach((key) => category[key] = req.body[key]);
    const updated = await Category.save(category);
    res.status(200).send(updated)

}));

router.delete('/categories/:id', auth, isAdmin, async (req, res) => {
    const categoryToRemoveId = req.params.id;
    const category: Category = await Category.createQueryBuilder('category')
        .where("category.id = :id", {id: categoryToRemoveId})
        .leftJoinAndSelect('category.childCategories', 'subCategory')
        .getOne();
    if (!category) {
        return res.status(404).send({error: 'No category with provided id'});
    }
    if (category.childCategories && category.childCategories.length > 0) {
        return res.status(400).send({error: 'Please remove child categories first'});
    }
    const result: DeleteResult = await Category.delete(req.params.id);
    res.status(200).send();
});

router.get('/categories/products/:id', async (req, res) => {
    const selectedCategory = req.params.id;
    const category = await Category.createQueryBuilder('category')
        .where("category.id = :id", {id: selectedCategory})
        .getOne();
    if (!category) return res.status(404).send({error: 'No category with provided id'});

    const products = await Category
        .createQueryBuilder("category")
        .where("category.id = :id", {id: selectedCategory})
        .leftJoinAndSelect('category.childCategories', 'subCategory')
        .leftJoinAndSelect("category.products", "products")
        .getOne();
    return res.send(products);
});

router.post('/categories/products/:id', auth, isAdmin, validateNewProduct, async (req, res) => {
    const selectedCategory = req.params.id;
    const category: Category = await Category.createQueryBuilder('category')
        .where("category.id = :id", {id: selectedCategory})
        .leftJoinAndSelect('category.childCategories', 'subCategory')
        .getOne();

    if (!category) return res.status(404).send({error: 'No category with provided id'});
    // if (category.childCategories && category.childCategories.length > 0 ) {
    //     return res.status(400).send({error: 'Restricted to add products to categories with subcategories'});
    // }

    const product = new Product();
    product.name = req.body.name;
    product.description = req.body.description;
    product.categories = [category];

    await product.save();
    return res.send(product);
});


export default router;
