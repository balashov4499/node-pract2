import {Category} from '../models/category';
import {DeleteResult} from 'typeorm';
import wrapAsync from '../middleware/requestFunctionsWrapper';
import {Product} from '../models/product';
import auth from '../middleware/auth';
import {isAdmin, isCustomer} from '../middleware/validators/userDataValidator';
import {Card} from '../models/card';
import {log} from 'util';
import {CardProductQuantity} from '../models/cardProductQuantity';


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

router.post('/products/select/:id/:quantity', auth, isCustomer, async (req, res) => {

    const user = req.user;
    if (!user.card) {
        user.card = new Card();
        await user.save();
    }
    const card = user.card;
    if (!card.cpq) {
        card.cpq = [];
        await card.save();
    }

    const selectedProductAndAmount = new CardProductQuantity();
    selectedProductAndAmount.productId = req.params.id;
    selectedProductAndAmount.quantity = req.params.quantity;
    card.cpq.push(selectedProductAndAmount);
    await card.save();
    res.status(200).send();
});

router.get('/products/me/in-card', auth, isCustomer, async (req, res) => {
    const card: Card = req.user.card;
    if (!card.cpq || card.cpq.length === 0) {
        return res.status(400).send('you dont have selected products');
    }

    const cpqs = await CardProductQuantity.query(`SELECT product.name, cpq.quantity FROM card_product_quantity cpq
    LEFT JOIN product ON product.id = cpq.productId WHERE cpq.cardId = ${card.id}`);

    res.send({selectedProducts: cpqs});
});

export default router;
