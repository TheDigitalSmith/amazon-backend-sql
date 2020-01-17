const express = require ('express');
const router = express.Router();
const db = require('../../../db');

//GET
//ALL
router.get('/', async(req,res)=>{
    let baseQuery = `SELECT * FROM products`
    const limit = req.query.limit;
    const offset = req.query.offset;
    const params = [limit,offset];
    delete req.query.limit;
    delete req.query.offset;

    let i = 0
    for(let query in req.query){
        baseQuery+= i === 0 ? ` WHERE ` : ` AND `
        baseQuery+= query + (`=$` + (i+3))
        params.push(req.query[query])
        i++
    }

    baseQuery += ` LIMIT $1 OFFSET $2`
    console.log(baseQuery);
    const response = await db.query(baseQuery, params);
    res.send(response.rows);
})

//BY ID
router.get('/:id',async(req,res)=>{
    const response = await db.query(`SELECT * FROM products WHERE _id =$1`,[req.params.id]);
    res.send(response.rows[0]);
})
//POST
router.post('/', async (req,res)=>{
    const entry = await db.query(`INSERT INTO products (name, description, brand, imageurl, price, category) 
                                VALUES ($1,$2,$3,$4,$5,$6)
                                RETURNING *`,
                                [req.body.name, 
                                req.body.description,
                                req.body.brand,
                                req.body.imageurl,
                                req.body.price,
                                req.body.category])
    res.send(entry.rows[0]);
})
//EDIT
router.put('/:id', async(req,res)=>{
    const edited = await db.query(`UPDATE products
                                SET name = $1,
                                description =$2,
                                brand =$3,
                                imageurl =$4,
                                price = $5,
                                category = $6
                                WHERE _id = $7
                                RETURNING *`,
                                [req.body.name,
                                req.body.description,
                                req.body.brand,
                                req.body.imageurl,
                                req.body.price,
                                req.body.category,
                                req.params.id
                                ])
    res.send(edited.rows[0]);
})

//DELETE
router.delete('/:id',async (req,res)=>{
    const remove = await db.query(`DELETE FROM products WHERE _id = $1`,[req.params.id]);
    console.log(remove);
    if (remove.rowCount > 0){
        res.send('removed');
    }
})

module.exports = router;