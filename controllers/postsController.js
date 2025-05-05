const prisma = require('../db/prisma');

const postsIndex = (req, res) => {
    res.json('Route on get.');
}


//createPost -- unique user
const getUserPost = async(req, res) => {
    try {
         const user = req.user;
         //get the data from db
         const posts = await prisma.getPostFromUser(user);
         res.json({
            success: true,
            data: posts,
         })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error,
        })
        return;
    }
}

const createPostPost = async(req, res) => {
    const userId = req.user.id;
    try {
        //create the post
        const result = await prisma.createPost(req.body.post_title, req.body.post_content, userId);
        res.json({
            success: true,
            data: result,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error,
        })
        return;
    }

};

const deletePost = async(req, res) => {
   try { 
     const postId = parseInt(req.body.postId);
 
     // const userId = req.user.id
     const userId = req.user.id;

     //find the post and delete it
     const response = await prisma.deletePost(postId, userId);
    if(!response){
        res.status(500).json({
            success: false,
            response,
    })
    return;
    }

    res.json({
        success: true,
        response
    });
    return;

   } catch (error) {
    res.status(500).json({
        success: false,
        error,
    })
   }
}
const modifyPost = async(req, res) => {
    const userId = req.user.id;
    try {
        //create the post
        const result = await prisma.modifyPost(req.body.postId ,req.body.post_title, req.body.post_content, userId);

        //return error if error
        if(!result) {
            res.send('error');
            return;
        }
        res.json({
            success: true,
            data: result,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error,
        })
        return;
    } 
};

//feed
const getUserFeed = async(req, res) => {
    //fetch data
try {
        const posts = await prisma.getAllPosts();
        res.json({
            data: posts,
            success: true,
        });
        return;
        
} catch (error) {
    res.status(500).json({
        data: '',
        success: false,
    })
    return;
}
}

//likes
const postLikes = async(req, res) => {
    try {

        const userId = req.user.id;
        const postId = req.body.postId;
        switch(req.body.data) {
            case 'like':
                await prisma.addALike(postId, userId);
                break;
            case 'dislike':
                await prisma.addADislike(postId, userId);
                break;
            default: 
                break;
        }
    res.json({});

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error,
        })
        return;
    }
}

const getLikesDislikes = async(req, res) => {
    try {
        const response = await prisma.getLikesDislikeFromPost(req.body.postId);
        res.json({
            data: response,
        })
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error,
        })
    }
}

const checkIfUInts= async(req,res) => {
    try {
        const response = await prisma.checkUIntsFromPost(req.body.postId, req.user.id);
        res.json({
            data: response
        })
        
    } catch (error) {
        res.status(500).json({
            error: error,
        })
    }
}






module.exports = {
    postsIndex,
    createPostPost,
    deletePost,
    modifyPost,
    getUserPost,
    getUserFeed,
    postLikes,
    getLikesDislikes,
    checkIfUInts,
}