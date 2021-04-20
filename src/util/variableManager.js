const db = require('../database/db');

const map = new Map();

module.exports = {
    reload: async () => {
        const variableModel = db.getVariableModel();

        try {
            const vars = await variableModel.findAll();

            map.clear();

            for(let i = 0; i < vars.length; i++) {
                let elem = vars[i];
                if(elem.isInt && elem.value != null)
                    elem.value = parseInt(elem.value);
                map.set(elem.key, elem.value);
            }

            console.log(map);

            return true;
        } catch(err) {
            console.log('Can\'t reload global variables');
            console.log(err);
            return false;
        }
    },

    get: (key) => map.get(key)
}