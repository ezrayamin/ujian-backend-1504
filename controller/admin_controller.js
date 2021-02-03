const {generateQuery, asyncQuery} = require('../helper/query')
const {createToken} = require('../helper/jwt')
const {validationResult} = require('express-validator')
const cryptojs = require('crypto-js')
const SECRET_KEY = process.env.CRYPTO_KEY
// CRYPTO_KEY=!@#$%^&*
const db = require('../database')

module.exports = {
    add: async (req, res) => {
        const { name, release_date, release_month, release_year, duration_min, genre, description} = req.body
        try {
            const qadd = `INSERT INTO movies (name, release_date, release_month, release_year, duration_min, genre, description) 
                          VALUES ('${name}', '${release_date}', '${release_month}',' ${release_year}', '${duration_min}', '${genre}', '${description}')`

            const result = await asyncQuery(qadd)

            const qupdate = `SELECT * from movies where id=${result.insertId} `
            const result2 = await asyncQuery(qupdate)
            res.status(200).send(result2)
        }
        catch (err) {
            console.log(err)
        }
    },
    edit: async (req, res) => {
        const { name, release_date, release_month, release_year, duration_min, genre, description} = req.body
        try {
            const qedit = `UPDATE movies SET${generateQuery(req.body)} 
                           WHERE status = ${db.escape(req.body.status)}`
            const result = await asyncQuery(qedit)
            const qget = `select id, 'status has been changed' as message from movies where id =${req.params.id}`
            const result2 = await asyncQuery(qget)
            res.status(200).send(result2)
        }
        catch (err) {
            console.log(err)
        }
    }
}