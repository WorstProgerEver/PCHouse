const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');
const crypto = require('crypto');

// GET ALL ORDERS
router.get('/', (req, res) => {
    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'o.status', 'p.title', 'p.description', 'p.price', 'u.username', 'od.quantity as quantityOrdered'])
        .sort({id: .1})
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.json({orders: orders});
            } else {
                res.json({message: "No orders found"});
            }

        }).catch(err => res.json(err));
});

// Get Single Order
router.get('/:id', async (req, res) => {
    let orderId = req.params.id;
    console.log(orderId);

    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title', 'p.description', 'p.price', 'p.image', 'od.quantity as quantityOrdered'])
        .filter({'o.id': orderId})
        .getAll()
        .then(orders => {
           
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.json({message: "No orders found"});
            }

        }).catch(err => res.json(err));
});

// Place New Order
router.post('/new', async (req, res) => {
    // let userId = req.body.userId;
    // let data = JSON.parse(req.body);
    let {userId, products} = req.body;

     if (userId !== null && userId > 0) {
        database.table('orders')
            .insert({
                user_id: userId
            }).then((newOrderId) => {

            if (newOrderId > 0) {
                products.forEach(async (p) => {

                        let data = await database.table('products').filter({id: p.id}).withFields(['quantity']).get();



                    let inCart = parseInt(p.incart);

                    // Deduct the number of pieces ordered from the quantity in database

                    if (data.quantity > 0) {
                        data.quantity = data.quantity - inCart;

                        if (data.quantity < 0) {
                            data.quantity = 0;
                        }

                    } else {
                        data.quantity = 0;
                    }

                    // Insert order details w.r.t the newly created order Id
                    database.table('orders_details')
                        .insert({
                            order_id: newOrderId,
                            product_id: p.id,
                            quantity: inCart
                        }).then(newId => {
                        database.table('products')
                            .filter({id: p.id})
                            .update({
                                quantity: data.quantity
                            }).then(successNum => {
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                });

            } else {
                res.json({message: 'New order failed while adding order details', success: false});
            }
            res.json({
                message: `Order successfully placed with order id ${newOrderId}`,
                success: true,
                order_id: newOrderId,
                products: products
            })
        }).catch(err => res.json(err));
    }

    else {
        res.json({message: 'New order failed', success: false});
    }

});

// Payment Gateway
router.post('/payment', (req, res) => {
    setTimeout(() => {
        res.status(200).json({success: true});
    }, 3000)
});

router.post("/confirm/:orderId", (req, res) => {
    let orderId = req.params.orderId;
  
    if (!isNaN(orderId)) {
      database
        .table("orders")
        .filter({ id: orderId })
        .update({
            status: 1
        }).then(successNum => {
              if (successNum == 1) {
                  res.status(200).json({
                      message: `Заказ #${orderId} успешно подтвержден`,
                      status: 'success'
                  });
              } else {
                  res.status(500).json({status: 'failure', message: 'Не удалось подтвердить заказ'});
            }
        })
        .catch((err) => res.status(500).json(err));
    } else {
      res
        .status(500)
        .json({ message: "ID не является числом", status: "failure" });
    }
  });  


module.exports = router;
