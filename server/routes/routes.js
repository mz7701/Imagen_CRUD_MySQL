const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const router = express.Router()

const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-ecommerce-' + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('image')

router.get('/', (req, res) => {
    res.send('Welcome to my image app')
})

router.post('/images/post', fileUpload,(req, res) => {

    req.getConnection((err, conn) => {
        if(err) return res.status(500).send('server error')

        const type = req.file.mimetype
        const name = req.file.originalname
        const size = req.file.size
        const data = fs.readFileSync(path.join(__dirname, '../images/' + req.file.filename))

        conn.query('INSERT INTO imagen set ?', [{type, name,size, data}], (err, rows) => {
            if(err) return res.status(500).send('server error')

            res.send('image saved!')
        })
    })
    
})

router.get('/images/get',(req,res)=>{
   req.getConnection((err,conn)=>{
       if(err) return res.status(500).send('server error')

       conn.query('SELECT * FROM imagen ORDER BY imagen.id',(err,rows)=>{
           if(err) return res.status(500).send('server error')
           //res.send('OK')
           //res.json(rows)
           console.log(rows)
           rows.map(img=>{
               fs.writeFileSync(path.join(__dirname, '../dbimages/' + img.id + '-ecommerce.png'), img.data)
           });

           const imgdir = fs.readdirSync(path.join(__dirname,'../dbimages/'))

           res.json(imgdir)
           console.log(rows)
           console.log(imgdir)
           console.log(fs.readdirSync(path.join(__dirname,'../dbimages/')))
       })
   })
})


router.delete('/images/delete/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.status(500).send('server error')
 
        conn.query('DELETE FROM imagen WHERE id = ?',[req.params.id],(err,rows)=>{
            if(err) return res.status(500).send('server error');

            fs.unlinkSync(path.join(__dirname, '../dbimages/' + req.params.id + '-ecommerce.png'))
            res.send('Image deleted!!');
        })
    })
 })
module.exports = router