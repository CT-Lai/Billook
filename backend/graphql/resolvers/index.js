import userResolver from './user.js';
import bookResolver from './book.js';
import paymentResolver from './payment.js';
// Root resolver
const root = {
    ...userResolver,
    ...bookResolver, 
    ...paymentResolver
};

export default root;
