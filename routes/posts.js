const express = require('express');
const router = express.Router();

const postsController = require('../controllers/postsController');

router.get('/', postsController.postsIndex);

//myposts
router.get('/myposts', postsController.getUserPost);

router.get('/feed', postsController.getUserFeed);

//get, create, delete, modify post
router.post('/create', postsController.createPostPost);
router.delete('/delete', postsController.deletePost);
router.put('/modify', postsController.modifyPost);

//likes/dislikes
router.post('/interactions', postsController.getLikesDislikes)
router.post('/likes', postsController.postLikes)
router.post('/ulikes', postsController.checkIfUInts);



module.exports = router;