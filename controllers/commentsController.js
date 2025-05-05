const prisma = require('../db/prisma')


const postCreateComm = async(req, res) => {
    try {
     const userId = req.user.id;
     const comments = req.body.comments;
     const postId = req.body.post_id;
     
    //  create
     await prisma.createComments(comments, postId, userId);

    res.json({
        success: true
    })
    return;
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error
        })
    }
}

const getComm = async(req, res) => {
    try {
        const post_id = parseInt(req.query.post_id);
        const comments = await prisma.getAllCommentsFromPost(post_id);
        res.json({
            success: true,
            data: comments
        });
        return;
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

const deleteComm = async(req, res) => {
    try {
        const com_id = parseInt(req.body.comId);
        //delete comm
        await prisma.deleteCommWithId(com_id);
        res.json({
            success: true,
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error,
        })
        return error
    }
}


module.exports = {
    postCreateComm,
    getComm,
    deleteComm
}