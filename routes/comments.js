var express = require('express');
var router = express.Router();

const commentsController = require('../controllers/commentsController')

//create comment
router.post('/', commentsController.postCreateComm);

//get comments from posts
router.get('/', commentsController.getComm)

router.get('/auth', (req, res) => {
    res.json({
        user: req.user,
    })
})

//delete comm
router.delete('/', commentsController.deleteComm)

module.exports = router;