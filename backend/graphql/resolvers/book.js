import model from '../../models/index.js';
import { transformBook } from './transformer.js';

const query = {
    books: async () => {
        try {
            const books = await model.Book.find();
            return books.map(book => {
                return transformBook(book);
        
            });
        } catch (err) {
            throw err;
        }
    },
    book: async args => {
        try {
            const book = await model.Book.findById(args.bookID);
            return transformBook(book);
         
        } catch (err) {
            throw err;
        }
    } 
}

const mutation = {
    createBook: async (args, req) => {
        if (!req.isAuth){
            throw new Error("Unauthenticated!")
        }
        const book = new model.Book({
            name: args.bookInput.name,
            board: args.bookInput.board? args.bookInput.board : 'no board yet',
            creator: args.bookInput.creator,
            membersList: [args.bookInput.creator],
            paymentsList: []
        });
        let createdBook;
        try {
            const result = await book.save();
            
            createdBook = transformBook(result);
            const creator = await model.User.findById(args.bookInput.creator);
            if (!creator){
                throw new Error("User not found");
            }
            creator.createdBooks.push(book);
            await creator.save();
            return createdBook;
            
        } catch (err) {
            throw err;
        }
    }, 

    deleteBook: async (args, req) => {
		    if(!req.isAuth) {
		        throw new Error('Unauthenticated');
		    }
        try{
            const book = await model.Book.findById(args.bookID);
            if (!book) {
                throw new Error("Book not found");
            }
            await model.Book.deleteOne({ _id: args.bookID});
            return transformBook(book);
        }catch(err){
            throw err;
        }

    }, 

    addMember: async (args, req) => {
		    if(!req.isAuth) {
		        throw new Error('Unauthenticated');
		    }
        try{
            const book = await model.Book.findById(args.bookID);
            if (!book) {
                throw new Error("Book not found");
            }
            if (book.membersList.find(member => member.toString() === args.userID)){
                throw new Error("User already a member");
            }
            book.membersList.push(args.userID);
            const result = await book.save();
            return transformBook(result);
        } catch(err) {
            throw err;
        }
    }, 
    removeMember: async (args, req) => {
		    if(!req.isAuth) {
		        throw new Error('Unauthenticated');
		    }
        try{
            const book = await model.Book.findById(args.bookID);
            if (!book) {
                throw new Error("Book not found");
            }
            if (!book.membersList.find(member => member.toString() === args.userID)){
                throw new Error("User not found");
            }
            book.membersList = book.membersList.filter(member => member.toString() !== args.userID);
            const result = await book.save();
            return transformBook(result);
        } catch (err) {
            throw err;
        }
    }
}

const bookResolver = {
    ...query, 
    ...mutation
}

export default bookResolver;