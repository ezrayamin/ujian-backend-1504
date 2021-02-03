const {generateQuery, asyncQuery} = require('../helper/query')
const {createToken} = require('../helper/jwt')
const {validationResult} = require('express-validator')
const cryptojs = require('crypto-js')
const SECRET_KEY = process.env.CRYPTO_KEY
// CRYPTO_KEY=!@#$%^&*
const db = require('../database')
let token
console.log(token)

module.exports = {
    register: async (req, res) => {
        const {username, password, email} = req.body
        
        const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(400).send(errors.array()[0].msg)
        
        const hashpass = cryptojs.HmacMD5(password, SECRET_KEY)

        try {
            const cekUser = `SELECT * FROM users
                            WHERE username='${username}' 
                            OR email='${email}'`
    
            const cekres = await asyncQuery(cekUser)
            if (cekres.length !== 0) return res.status(400).send('username/email has already exist')
            
            const qadd = `INSERT INTO users(uid, username, email, password, role, status) 
                          VALUES ('${Date.now()}', '${username}', '${email}', ${db.escape(hashpass.toString())}, 1, 1)`
            const resadd = await asyncQuery(qadd)
            const qtoken = `SELECT id, uid, username, email, role FROM users where id=${resadd.insertId}`
            const restoken = await asyncQuery(qtoken)
            console.log(restoken[0])
            token = createToken({uid: restoken[0].uid, role: restoken[0].role})
            console.log(token)
            const qshow = `SELECT id, uid, username, email, '${token}' as token FROM users where id=${resadd.insertId}`
            const result = await asyncQuery(qshow)
            res.status(200).send(result[0])
            return token
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    login: async (req, res) => {
        const {username, password} = req.body
        // console.log(req.headers)
        try {
            const hashpass = cryptojs.HmacMD5(password, SECRET_KEY)
            // 
            const queryLogin = `SELECT id, uid, username, email, status, role, '${token}' as token FROM users
                                WHERE username=${db.escape(username)} 
                                AND password=${db.escape(hashpass.toString())}
                                AND status <> 3`
            const result = await asyncQuery(queryLogin)
            if (result.length === 0) return res.status(400).send('Invaid username or password')
            res.status(200).send(result[0])
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    deactive: async (req, res) => {
        try {
            const cek = `SELECT * FROM user WHERE token='${req.body.token}'`
            const resCek = await asyncQuery(cek)
            console.log(resCek)
            if (resCek.length === 0) return res.status(400).send(`token ${req.body.token} isn't available`)
            
            const qedit = `UPDATE products SET status='deactive'
                            WHERE token='${req.body.token}'`
            await asyncQuery(qedit)
            console.log(qedit)
            const qnew = `SELECT uid, status FROM user WHERE token='${req.body.token}'`
            const result2 = await asyncQuery(qnew)
            res.status(200).send(result2)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    active: async (req, res) => {
        try {
            const cek = `SELECT * FROM user WHERE token='${req.body.token}'`
            const resCek = await asyncQuery(cek)
            console.log(resCek)
            if (resCek.length === 0) return res.status(400).send(`token ${req.body.token} isn't available`)
            
            const qedit = `UPDATE products SET status='active'
                            WHERE token='${req.body.token}'`
            await asyncQuery(qedit)
            console.log(qedit)
            const qnew = `SELECT uid, status FROM user WHERE token='${req.body.token}'`
            const result2 = await asyncQuery(qnew)
            res.status(200).send(result2)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    delete: async (req, res) => {
        try {
            const cek = `SELECT * FROM user WHERE token='${req.body.token}'`
            const resCek = await asyncQuery(cek)
            console.log(resCek)
            if (resCek.length === 0) return res.status(400).send(`token ${req.body.token} isn't available`)
            
            const qedit = `UPDATE products SET status='closed'
                            WHERE token='${req.body.token}'`
            await asyncQuery(qedit)
            console.log(qedit)
            const qnew = `SELECT uid, status FROM user WHERE token='${req.body.token}'`
            const result2 = await asyncQuery(qnew)
            res.status(200).send(result2)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}