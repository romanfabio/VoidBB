const {randomInt} = require('crypto');
console.log(generateSecureString(64).length);






function generateSecureString(length) {
    const buffer = ['7','X','R','b','r','t','l','f','q','Q','S','8','v','h','s','o','d','5','K','R','y','g','A','S','H','G','5','O','A','F','T','k','j','x','O','W','o','O','6','V','B','R','S','7','4','a','2','o','q','k','r','P','J','b','g','P','A','c','Z','T','8','p','R','M','0','z','C','c','8','K','N','J','v','p','T','8','8','T','g','V','1','d','E','a','I','O','H','0','1','B','a','z','1','o','a','A','m','E','a','k'];
    let result = "";
    while(result.length < length) {
        result += buffer[randomInt(buffer.length)];
    }

    return result;
}