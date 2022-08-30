const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include:[{model: Product}]
  }).then(data=>{
    res.json(data)
  }).catch(err=>{
    res.status(500).json({msg: "Server Error"})
  })
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{model:Product}]
    });
  if (!categoryData) {
    res.status(404).json({
      msg: "Category ID not Found"
    });
  }
  res.status(200).json(categoryData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try{
    const newCategory = await Category.create({
      category_name:req.body.category_name,
    })
    res.status(201).json(newCategory)
  }catch(err){
    console.log(err)
    res.status(500).json({
      msg:"Server Error", err
    })
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update({
    category_name:req.body.category_name
  },
      {
      where:{
          id:req.params.id
      }
      }).then(category=>{
          if(!category[0]){
              return res.status(404).json({
                msg:"Category Does Not Exist or No Change Was Made"
              })
          }
      res.json(category)
  }).catch(err=>{
      res.status(500).json({
        msg:"Server Error",err
      })
  })
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where:{
      id:req.params.id
    }
  }).then(category=>{
    if(!category){
      return res.status(404).json({
        msg:"Category Does Not Exist"
      })
    }
    res.json(category)
  }).catch(err=>{
    res.status(500).json({
      msg:"internal server error",err
    })
  })
});

module.exports = router;
