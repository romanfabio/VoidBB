const db = require('../database/db');

const map = new Map();

module.exports = {
    reload: () => {
        const variableModel = db.getVariableModel();

        variableModel.findAll().then((value) => {
            map.clear();
            for(let i = 0; i < value.length; i++) {
                let elem = value[i];
                if(elem.isInt && elem.value != null)
                    elem.value = parseInt(elem.value);
                map.set(elem.key, elem.value);
            }

            console.log(map);

        }, (err) => {
            console.log('Can\'t reload global variables');
            console.log(err);
        });
    },

    get: (key) => map.get(key)
}