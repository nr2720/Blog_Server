const express = require('express');
const asyncHandler = require('express-async-handler');

const utils = require('../crypto/utils');
const prisma = require('../db/prisma');


const session = require('express-session');





//users/
const indexGet = (req, res, next) => {
    res.send('Get on index !')
}



//users/register

const registerGet = asyncHandler(async(req, res, next) => {
    res.render('register');
})

const registerPost = asyncHandler(async(req, res) => {
    //generate salt and hash
    const saltHash = utils.genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    prisma.createUser(hash, salt, req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.username)

    .then(async (user) => {
        try {
        //get the token
        const jwt = utils.issueJWT(user.id);

        res.json({
            success: true,
            user: user,
            token: jwt.token,
            expiresIn: jwt.expires,
        })
            
        } catch (error) {
            res.status(500).json({
            });
            console.error(error);
            return;
        }
    })
    .catch(error => {
        res.json({
            error: 'Username or Email already taken.'
        })
    })
})


//users/login
const loginGet = asyncHandler(async(req, res) => {
    res.render('login');
})

const loginPost = async(req, res) => {
    try {
        const {username, password} = req.body;
        
        //find the user on email
        const user = await prisma.getUserByUsername(username);

        //if user do not exist
        if(!user) {
            res.status(401).json({
                success: false,
                msg: 'Could not find user'
            })
            return;
        }

        //Check if password is valid
        const isValid = utils.validPassword(password, user.user_hash, user.user_salt);
        
        //If its valid issue a jwt
        if(isValid) {
            const tokenObject = utils.issueJWT(user);
            res.status(200).json({
                success: true,
                token: tokenObject.token,
                expires: tokenObject.expires
            });
        } else {
            res.status(401).json({
                success: false,
                msg: 'Wrong password.'
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error,
        })
        return;
    }
}



//users/protected -- profile page here, get information from the user
const protectedGet = async(req, res) => {
    try {
        
        const data = {
            username: req.user.username,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            phone: req.user.phone_number,
            profile_picture: req.user.profile_picture,
        }
        res.json({
            success: true,
            data,
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error,
        })
        return;
    }
}




const pdpPost = async(req, res) => {
    try {
        await prisma.changePdp(req.user.id, req.file.path);
        res.json({
            success: true,
        })
        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error,
        })
    }


}




















module.exports = {
    indexGet,
    registerGet,
    registerPost,
    loginGet,
    loginPost,
    protectedGet,
    pdpPost
}