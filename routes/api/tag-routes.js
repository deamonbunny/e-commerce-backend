const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll(({
    include: [{model: Product}]
  })).then(data=>{
    res.json(data)
  }).catch(err=>{
    res.status(500).json({
      msg: "Server Error", err
    })
  })
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try { 
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model:Product}]
    });
  if (!tagData) {
    res.status(404).json({
      msg: "Product ID not Found"
    });
    return;
  }
  res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try{
    const newTag = await Tag.create({
      tag_name: req.body.tag_name
    })
    res.status(201).json(newTag)
  }catch(err){
    console.log(err)
    res.status(500).json({
      msg:"Server Error", err
    })
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update({
    tag_name:req.body.tag_name
  },
    {
      where:{
        id:req.params.id
      }
    }).then(tag=>{
      if(!tag[0]){
        return res.status(404).json({
          msg:"Tag Not Found or No Changes Made"
        })
      }
      res.json(tag)
    }).catch(err=>{
      res.status(500).json({
        msg:"Server Error", err
      })
    })
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where:{
      id:req.params.id
    }
  }).then(tag=>{
    if(!tag){
      return res.status(404).json({
        msg: "Tag ID not Found"
      })
    }
    res.json(tag)
  }).catch(err=>{
    res.status(500).json({
      msg:"Server Error", err
    })
  })
});

module.exports = router;
