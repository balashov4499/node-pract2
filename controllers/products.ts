import {Category} from '../models/category';
import {DeleteResult} from 'typeorm';
import wrapAsync from '../middleware/requestFunctionsWrapper';
import {Product} from '../models/product';
import auth from '../middleware/auth';
import {isAdmin} from '../middleware/userDataValidator';


const express = require('express');
const router = new express.Router();

router.get('/products/:id', wrapAsync(async function (req, res) {

    const selectedProductId = req.params.id;
    const product = await Product.createQueryBuilder('product')
        .where("product.id = :id", {id: selectedProductId})
        .leftJoinAndSelect('product.categories', 'categories')
        .getOne();
    if (!product) return res.status(404).send({error: 'No product with provided id'});
    return res.send(product);
}));

router.put('/products/:id', auth, isAdmin, wrapAsync(async function (req, res) {
    const selectedProductId = req.params.id;
    const product = await Product.createQueryBuilder('product')
        .where("product.id = :id", {id: selectedProductId})
        .leftJoinAndSelect('product.categories', 'categories')
        .getOne();
    if (!product) return res.status(404).send({error: 'No product with provided id'});

    const newAddedCategories: Category[] = await Category.createQueryBuilder("category")
        .where("category.id IN (:ids)", {ids: req.body.categories})
        .getMany();

    const keysToUpdate = Object.keys(req.body);
    keysToUpdate.forEach((key) => {
        if (key === 'categories') {
            product[key] = product[key].concat(newAddedCategories);
        } else {
            product[key] = req.body[key]
        }
    });
    const updated = await Product.save(product);
    res.status(200).send(updated)

}));

router.delete('/products/:id', auth, isAdmin, async (req, res) => {
    const result: DeleteResult = await Product.delete(req.params.id);
    res.status(200).send();
});


export default router;
