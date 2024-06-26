import bcrypt from 'bcryptjs';
import models from '../../models/index.js';

import { transformUser } from './transformer.js';
import jwt from 'jsonwebtoken';
console.log('user.js');
const query = {
    login: async args => {
        try {
            const user = await models.User.findOne({email: args.email});
            if (!user) {
                throw new Error('User does not exist');
            }
            const isEqual = await bcrypt.compare(args.password, user.password);
            if (!isEqual) {
                throw new Error('Password is incorrect');
            }
            const token = jwt.sign(
	            {userId: user.id, email: user.email, username: user.username}, 
	            'genshinImpactActivate',
	            {expiresIn: '1h'}
		    );
            return { userId: user.id, token: token, tokenExpiration: 1 }
        } catch(err) {
            throw err;
        }
    },
    users: async () => {
        console.log("users")
        try {
            console.log("users")
            const users = await models.User.find();
            console.log("users")
            return users.map(user => {
                return transformUser(user);
            });
        } catch (err) {
            console.log(err)
            throw err;
        }
    },
    user: async args => {
        try {
            const user = await models.User.findById(args.userID)
            if (!user) {
                throw new Error("User not found");
            }
            return transformUser(user);
        } catch (err) {
            throw err;
        }
    },
}

const mutation = {
    createUser: async args => {
        try {
            const tryFindUserWithEmail = await models.User.findOne({email: args.userInput.email});
            if (tryFindUserWithEmail) {
                throw new Error('User already exists. Sign up with another email.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new models.User({
                username: args.userInput.username,
                password: hashedPassword,
                email: args.userInput.email,
                createdBooks: []
            });
            let createdUser;
            const result = await user.save();
            createdUser = transformUser(result);
            return createdUser;
        } catch (err) {
            throw err;
        }
    }, 
}

const userResolvers = {
    ...query,
    ...mutation
}

export default userResolvers