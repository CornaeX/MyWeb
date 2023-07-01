const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'admin';
const someOtherPlaintextPassword = 'not_bacon';

var encryptHash = '';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    
    encryptHash = hash;
    
    console.log(myPlaintextPassword); 
    console.log(encryptHash);    
});

bcrypt.compare(myPlaintextPassword, encryptHash, function(err, result) {
    console.log(result);
});