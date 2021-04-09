const validator = require('validator');
const variable = require('./variableManager');

module.exports = {
    isUsername: (str) => {
        return /^[\x41-\x5A\x5F\x61-\x7A][\x30-\x39\x41-\x5A\x5F\x61-\x7A]*$/.test(str) &&
            str.length >= variable.get('USERNAME_MIN_LENGTH') &&
            str.length <= variable.get('USERNAME_MAX_LENGTH');
    },
    isPassword: (str) => {
        return validator.isStrongPassword(str) &&
            str.length >= variable.get('PASSWORD_MIN_LENGTH') &&
            str.length <= variable.get('PASSWORD_MAX_LENGTH');
    },
    isEmail: (str) => {
        return validator.isEmail(str);
    },
    isForumName: (str) => {
        return /^[\x2D\x30-\x39\x41-\x5A\x5F\x61-\x7A]+$/.test(str) &&
            str.length > 0 &&
            str.length <= variable.get('FORUM_NAME_MAX_LENGTH');
    },
    isForumDescription: (str) => {
        return str.length > 0 &&
            str.length <= variable.get('FORUM_DESCRIPTION_MAX_LENGTH');
    },
    isPostTitle: (str) => {
        return str.length > 0 &&
            str.length <= variable.get('POST_TITLE_MAX_LENGTH');
    }
};

//TODO
//Cambia l'ordine di valutazione delle condizioni (motivo: inutile controllare regex costosa se lunghezza non è conforme)