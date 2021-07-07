const express = require('express');
const multer = require('multer');

const Product = require('./models');
const productMiddleware = require('../../middleware/product');
const uploadMiddleware = require('../../middleware/uploadImage');

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

router.get('/getAllProducts', (req, res) => {
    Product.find((err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json(data);
        }
    });
});

router.get('/getProduct', (req, res) => {
    const filter = req.query;
    Product.find(filter, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json({
                success: true,
                data: data
            });
        }
    });
});


router.post('/category', (req,res) => {
    model = new Product(req.body);
    model.save((err,data)=> {
        if(err) {
            res.status(400).json(err.msg)
        } else {
            res.status(200).json({
                status: true,
                message: "New Category is added"
            });
        }
    });
})

router.put('/updateProduct/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    Product.findOneAndUpdate({ _id: id }, body, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json(data);
        }
    });
});

router.delete('/deleteProduct/:id', productMiddleware.deleteProductDetails, productMiddleware.deleteProductReview, (req, res) => {
    const id = req.params.id;
    Product.findOneAndDelete({ _id: id }, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json(data);
        }
    });
});


// Product Details
router.get('/productDetails/:id', (req, res) => {
    const productId = req.params.id;
    Product.find({ productId: productId }, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json({
                success: true,
                data: data

            });
        }
    });
});

router.post('/addProductDetails', (req, res) => {
    let model = new Product(req.body);
    model.save((err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json({
                success: true,
                message: 'Product Details Added into the database'
            });
        }
    });
});

//Get Product
router.get('/getProduct', (req,res) => {
    let opt = req.body.query
    Product.find(opt, (err,data) => {
        if (err) {
            res.status(400).json(err.message)
        } else {
            res.status(200).json({
                status: true,
                data: data
            })
        }
    });
});

router.get("/whiteCategory", (req, res) => {
    let query = req.body;
    Product.aggregate(
      [{ $match: { category: "White", ...query } }],
      (err, data) => {
        if (err) {
          res.json(err.message);
        } else {
          res.json({
            status: true,
            data: data,
          });
        }
      }
    );
  });

router.get("/redCategory", (req, res) => {
    let query = req.body;
    Product.aggregate(
      [{ $match: { category: "Red", ...query } }],
      (err, data) => {
        if (err) {
          res.json(err.message);
        } else {
          res.json({
            status: true,
            data: data,
          });
        }
      }
    );
  });
  

  router.get("/getProductByName", (req, res) => {
    let filter = req.query.body;
    Product.aggregate([{ $match: { name: filter } }], (err, data) => {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          success: true,
          data: data,
        });
      }
    });
  });


  router.get("/seaCategory", (req, res) => {
    let query = req.body;
    Product.aggregate(
      [{ $match: { category: "Sea", ...query } }],
      (err, data) => {
        if (err) {
          res.json(err.message);
        } else {
          res.json({
            status: true,
            data: data,
          });
        }
      }
    );
  });
  
  
router.post('/addProduct', (req,res) => {
    let model = new Product.Details(req.body);

    model.save((err, data) => {
        if (err) {
            res.status(400).send(ree.message);
        } else {
            res.json({
                success: true,
                message: "Product Added"
            });
        }
    });
});

router.put('/updateProductDetails/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    Product.findOneAndUpdate({ _id: id }, body, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.status(200).json(data);
        }
    });
});

router.post('/addProductImage', upload.single("product"), uploadMiddleware.uploadProductImage);

router.post('/uploadProductImage', (req, res) => {
    let model = new Product.Image(req.body);
    model.save((err, profile) => {
        if (err) {
            res.send(err);
        } else {
            res.json('Product Images uploaded successfully into Database');
        }
    });
});


module.exports = router;