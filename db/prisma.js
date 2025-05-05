const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const asyncHandler = require('express-async-handler');

const cloudinary = require('../db/cloudinary');

//General
const getAllUsers = asyncHandler(async() => {
    const users = await prisma.users.findMany()
    console.log(users);
});



//Users
const getUserById = asyncHandler(async (user_id) => {
    const user = await prisma.users.findUnique({
        where: {
            id: user_id,
        }
    });
    return user;
})

const createUser = async(user_hash, user_salt, first_name, last_name, email, phone_number, username) => {
    try {
        const result = await prisma.users.create({
            data: {
                user_hash,
                user_salt,
                first_name,
                last_name,
                email, 
                phone_number,
                username
            }
        })
        return result;
        
    } catch (error) {
        console.log(error);
        return error;
    }
}

const getUserByEmail = async(email) => {
    
    try {
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        });
        return user;
    } catch (error) {
        console.error(error);
        return;
    }
}

const getUserByUsername = async(username) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                username
            }
        });
        return user;
        
    } catch (error) {
        console.error(error);
        return;
    }
}


//POSTS

const createPost = async(post_title, post_content, user_id) => {
    try {
        const result = await prisma.posts.create({
            data: {
                post_title,
                post_content,
                user_id,
            }
        });
        return {success: true, result}
    } catch (error) {
        console.error(error);
        return error;
    }
}


const deletePost = async(postId, userId) => {
    try { 
        //find the post
        const post = await prisma.posts.findUnique({
            where: {
                id: postId,
                user_id: userId,
            }
        })
        
        if(!post) {
            return post;
        }

        //delete the post
        const response = await prisma.posts.delete({
            where: {
                id: postId,
            }
        });

        return response;
        
    } catch (error) {
        return error;
    }
}

const modifyPost = async(postId, post_title, post_content, userId) => {

    try {
        //check auth
        const post = await prisma.posts.findUnique({
            where: {
                id: postId,
                user_id: userId,
            }
        })
        if(!post) {
            return post;
        }

        //modify post
        const result = await prisma.posts.update({
            where: {
                id: postId,
            },
            data: {
                post_title,
                post_content,
            }

        });
        return result;
        
    } catch (error) {
        console.error(error);
        return error;
    }
}

const getPostFromUser = async(user) => {
    try {
     const posts = await prisma.posts.findMany({
        where: {
            user_id: user.id,
        }
     });
     return posts;
    } catch (error) {
        console.error(error);
        return error;
    }
}

const getAllPosts = async() => {
    try {
        const response = await prisma.posts.findMany({
            include: {
                users: true,
                comments: true,
                likes: true,
                dislikes: true,
              },
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}

//likes

const addALike = async(postId, userId) => {
    try {
        //check if the like is already alimenté
        const like = await prisma.likes.findFirst({
            where: {
                post_id: postId,
                user_id: userId,
            }
        })
        //same shit with the dislike
        const dislike = await prisma.dislikes.findFirst({
            where: {
                post_id: postId,
                user_id: userId,
            }
        });
        if(like) {
            return;
        }
        else if(dislike) {
            //delete the dislike
            await prisma.dislikes.delete({
                where: {
                    id: dislike.id,
                }
            });
        }

            //add the like
            await prisma.likes.create({
                data: {
                    user_id: userId,
                    post_id: postId,
                }
            });
            return;

    } catch (error) {
        console.error(error);
        return error;
    }
}

const addADislike = async(postId, userId) => {
    try {
        //check if the like is already alimenté
        const like = await prisma.likes.findFirst({
            where: {
                post_id: postId,
                user_id: userId,
            }
        })
        //same shit with the dislike
        const dislike = await prisma.dislikes.findFirst({
            where: {
                post_id: postId,
                user_id: userId,
            }
        });
        if(dislike) {
            return;
        }
        else if(like) {
            //delete the like
            await prisma.likes.delete({
                where: {
                    id: like.id,
                }
            });
        }

        //add the dislike
        await prisma.dislikes.create({
            data: {
                user_id: userId,
                post_id: postId,
            }
        });
            return;
    } catch (error) {
        console.error(error);
        return error;
    }
}

const getLikesDislikeFromPost = async(postId) => {
    try {
        //get data likes
        const likes = await prisma.likes.findMany({
            where: {
                post_id: postId
            }
        });

        //get data dislikes
        const dislikes = await prisma.dislikes.findMany({
            where: {
                post_id: postId
            }
        })

        const interactions = {
            likes,
            dislikes,
        }

        return interactions;

    } catch (error) {
        return error;
    }
}

const checkUIntsFromPost = async(postId, userId) => {
    try {
        const likes = await prisma.likes.findFirst({
            where: {
                post_id: postId,
                user_id: userId,
            }
        })
        const dislikes = await prisma.dislikes.findFirst({
            where: {
                post_id: postId,
                user_id: userId,
            }
        })

        const ints = {
            likes,
            dislikes
        }

        return ints;
    } catch (error) {
        console.log(error);
        return error;
    }
}



//comments
const createComments = async(comments, post_id, user_id) => {
    try {
        //create the post
        await prisma.comments.create({
            data: {
                comments,
                post_id,
                user_id,
            }
        })
        return;
    } catch (error) {
        console.error(error);
        return
    }
}

const getAllCommentsFromPost = async(post_id) => {
    try {
        const data = await prisma.comments.findMany({
            where: {
                post_id
            },
            include: {
                users: true,
            }
        });
        if(!data) {
            return [];
        }
        return data;
    } catch (error) {
        console.error(error);
        return
    }
}




//pdp

const changePdp = async(user_id, file) => {
    try {
        //get the upload
        const cloudFile = await cloudinary.uploadImg(file);
        const url = await cloudinary.getUrl(cloudFile);

        await prisma.users.update({
            where: {
                id: user_id,
            },
            data: {
                profile_picture: url,
            }
        })
        
        return true;
        
    } catch (error) {
        console.error(error);
        return;
    }
}



//delete comm

const deleteCommWithId = async(comm_id) => {
    await prisma.comments.delete({
        where: {
            id: comm_id
        }
    });
}








module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    getUserByEmail,
    getUserByUsername,
    createPost,
    deletePost,
    modifyPost,
    getPostFromUser,
    getAllPosts,
    addALike,
    addADislike,
    getLikesDislikeFromPost,
    checkUIntsFromPost,
    createComments,
    getAllCommentsFromPost,
    changePdp,
    deleteCommWithId
}