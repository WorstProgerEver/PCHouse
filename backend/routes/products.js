const express = require('express');
const router = express.Router();
const {check, validationResult, body} = require('express-validator');
const {database} = require('../config/helpers');

/* GET ALL PRODUCTS */
router.get('/', function (req, res) {       // Sending Page Query Parameter is mandatory http://localhost:3636/api/products?page=1
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;   // set limit of items per page
    let startValue;
    let endValue;
    if (page > 0) {
        startValue = (page * limit) - limit;     // 0, 10, 20, 30
        endValue = page * limit;                  // 10, 20, 30, 40
    } else {
        startValue = 0;
        endValue = 10;
    }
    database.table('products as p')
        .join([
            {
                table: "categories as c",
                on: `c.id = p.cat_id`
            }
        ])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.description',
            'p.image',
            'p.id'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({message: "No products found"});
            }
        })
        .catch(err => console.log(err));
});

/* GET ONE PRODUCT*/
router.get('/:prodId', (req, res) => {
    let productId = req.params.prodId;
    database.table('products as p')
        .join([
            {
                table: "categories as c",
                on: `c.id = p.cat_id`
            }
        ])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.description',
            'p.image',
            'p.id',
            'p.images'
        ])
        .filter({'p.id': productId})
        .get()
        .then(prod => {
            console.log(prod);
            if (prod) {
                res.status(200).json(prod);
            } else {
                res.json({message: `No product found with id ${productId}`});
            }
        }).catch(err => res.json(err));
});

/* SEARCH FOR A PRODUCT */
router.get('/search/:title/:catId', (req, res) => {
    
    let productTitle = req.params.title
    let catId = req.params.catId
    if (!productTitle) {
        res
        .status(500)
        .json({ message: "Не задано название", status: "failure" });
    } else {
        let sql = `SELECT p.* FROM products AS p
        LEFT JOIN categories AS c ON p.cat_id = c.id
        WHERE p.title LIKE '%` + productTitle + `%'`
        console.log(catId)
        if (catId != 0) {
            sql += ` AND p.cat_id = ` + catId + ` `
        }
        sql += ` ORDER BY p.id DESC `
        console.log(sql);
        database.query(
            sql,
            function (error, results, fields) {}
            ).then(results => {
                console.log("prod");
                console.log(results);
                if (results) {
                    res.status(200).json({
                        count: results.length,
                        products: results
                    });
                } else {
                    res.json({message: `Товары не найдены ${productTitle}`});
                }
            }).catch(err => res.json(err));
    }
    
});

/* GET ALL PRODUCTS FROM ONE CATEGORY */
router.get('/category/:catId', (req, res) => { // Sending Page Query Parameter is mandatory http://localhost:3636/api/products/category/categoryName?page=1
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;   // check if page query param is defined or not
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;   // set limit of items per page
    let startValue;
    let endValue;
    if (page > 0) {
        startValue = (page * limit) - limit;      // 0, 10, 20, 30
        endValue = page * limit;                  // 10, 20, 30, 40
    } else {
        startValue = 0;
        endValue = 10;
    }

    // Get category title value from param
    const cat_id = req.params.catId;

    database.table('products as p')
        .join([
            {
                table: "categories as c",
                // on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
                on: `c.id = p.cat_id'`
            }
        ])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.description',
            'p.image',
            'p.id'
        ])
        .filter({'c.id': cat_id})
        .slice(startValue, endValue)
        .sort({id: 1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({message: `No products found matching the category ${cat_title}`});
            }
        }).catch(err => res.json(err));

});

router.post('/create', async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        let title = req.body.title
        let image = req.body.image
        let images = req.body.images
        let description = req.body.description
        let price = req.body.price
        let quantity = req.body.quantity
        let short_desc = req.body.short_desc
        let cat_id = req.body.cat_id

        database.table('products').insert({
            title: title,
            image: image,
            images: images || null,
            description: description,
            price: price,
            quantity: quantity,
            short_desc: short_desc,
            cat_id: cat_id || null
        }).then(lastId => {
            if (lastId > 0) {
                res.status(201).json({
                    status: 'success',
                    message: `Добавлен новый товар ${title}`});
            } else {
                res.status(501).json({
                    status: 'failure',
                    message: 'Не удалось добавить товар'
                });
            }
        }).catch(err => res.status(433).json({error: err}));
    }
});

router.delete("/delete/:prodId", (req, res) => {
    let prodId = req.params.prodId;
  
    if (!isNaN(prodId)) {
      database
        .table("products")
        .filter({ id: prodId })
        .remove()
          .then(successNum => {
              if (successNum == 1) {
                  res.status(200).json({
                      message: `Record deleted with product id ${prodId}`,
                      status: 'success'
                  });
              } else {
                  res.status(500).json({status: 'failure', message: 'Cannot delete the product'});
            }
        })
        .catch((err) => res.status(500).json(err));
    } else {
      res
        .status(500)
        .json({ message: "ID is not a valid number", status: "failure" });
    }
  });  


module.exports = router;
