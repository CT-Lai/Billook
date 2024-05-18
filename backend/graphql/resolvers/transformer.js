import models from '../../models/index.js'; 


const transformUser = user => {
    return {
        ...user._doc,
        _id: user.id,
    };
}

const transformPayment = payment => {
    return {
        ...payment._doc,
        _id: payment.id,
        paidBy: getSingleTransformedUser.bind(this, payment._doc.paidBy),
        sharedBy: getListTransformedUser.bind(this, payment._doc.sharedBy),
    };
}

const transformBook = book => {
    return {
        ...book._doc,
        _id: book.id,
        creator: getSingleTransformedUser.bind(this, book._doc.creator),
        membersList: getListTransformedUser.bind(this, book._doc.membersList),
        paymentsList: book._doc.paymentsList.map(payment => {
            return transformPayment(payment);
        }),
    };
}

const getSingleTransformedUser = async userID => {
    try {
        const user = await models.User.findById(userID);
        return transformUser(user);
    } catch (err) {
        throw err;
    }
}

const getListTransformedUser = async userIDs => {
    try {
		    // # .find(): MongoDB Model
		    // #  { _id: { $in: userIDs } }
		    // searches for users whose _id is contained within the userIDs array 
		    // using the $in operator. 
        const users = await models.User.find({ _id: { $in: userIDs } });
        return users.map(user => {
            return transformUser(user);
        });
    } catch (err) {
        throw err;
    }
}

const getListTransformedBooks = async bookIDs => {
    try {
        const books = await Book.find({ _id: { $in: bookIDs } });
        return books.map(book => {
            return transformBook(book);
        });
    } catch (err) {
        throw err;
    }
}


export { transformUser, transformBook, getSingleTransformedUser, getListTransformedUser, getListTransformedBooks };
