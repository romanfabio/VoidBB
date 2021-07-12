const map = new Map();

module.exports = {
    reload: async (database) => {

        const vars = await database.select('*').from('Variables');

        map.clear();

        for (let i = 0; i < vars.length; i++) {
            let elem = vars[i];
            if (elem.isInt && elem.value != null)
                elem.value = parseInt(elem.value);
            map.set(elem.key, elem.value);
        }

    },

    get: (key) => map.get(key),

}

