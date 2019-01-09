const _ = require('lodash');
const momentTz = require('moment-timezone');

/**
 * @description Converts set of dates in <obj> defined in <fieldArr>
 * @param obj
 * @param fieldArr
 * @param timezone
 */
exports.formatDates = (obj, fieldArr, timezone) => {

    if (!obj) throw new Error('No object defined!');
    if (!fieldArr) throw new Error('No set of paths defined!');
    if (!timezone) throw new Error('No timezone defined!');

    // set the value of each given field
    fieldArr.forEach(set => {
        let path, fields, fin;

        // define variables
        if (typeof set === 'object') {
            path = set['path'];
            fields = set['fields'];
        } else { path = set; }

        // value from the path
        const val = pathByString(obj, path);

        if (Array.isArray(val)) {
            // the <fin> value is array with formatted fields
            fin = [];
            val.forEach(v => {
                v = exports.formatDates(v, fields, timezone);
                fin.push(v);
            });
        } else {
            // the <fin> value is only the formatted date
            fin = momentTz(val).tz(timezone).format();
        }

        // set the final value
        _.set(obj, path, fin);
    });

    // return the final object
    return obj;

};

/**
 * @description Returns value of a nested/non-nested object by dot-string path
 * @param o
 * @param s
 * @returns {*}
 */
function pathByString(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    let a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        let k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}