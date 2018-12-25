const schemaFields = require('../assets/schema-fields.asset');
const codeGenerator = require('./generators/generic-code.generator');
const moment = require('moment');

/**
 * @description: Validates an inputted email
 * @param email
 * @return {boolean}
 */
exports.validateEmail = function (email) {
    return schemaFields.EMAIL.REG_EXP.test(email);
};

/**
 * @description: Checks if the passed in password is strong enough
 * @param password
 * @return {boolean}
 */
exports.passwordStrength = function (password) {
    return schemaFields.PASSWORD.REG_EXP.test(password);
};

/**
 * @description Input Validator class
 * @type {inputValidator}
 */
exports.inputValidator = class {

    /**
     * @description If value is present
     * @param val
     * @return {boolean}
     */
    static isPresent(val) { return !!val; }

    /**
     * @description If value is lowercase
     * @param val
     * @return {boolean}
     */
    static isLowerCase(val) { return val === val.toLowerCase(); }

    /**
     * @description If value is uppercase
     * @param val
     * @return {boolean}
     */
    static isUpperCase(val) { return val === val.toUpperCase(); }

    /**
     * @description If value is a valid number
     * @param val
     * @return {boolean}
     */
    static isNumber(val) { return !isNaN(val); }

    /**
     * @description If value is valid boolean
     * @param val
     * @return {boolean}
     */
    static isBoolean(val) { return typeof val === typeof(true) }

    /**
     * @description If value is a valid ObjectId
     * @param val
     * @return {*}
     */
    static isObjectId(val) { return /^[0-9a-fA-F]{24}$/.test(val); }

    /**
     * @description If value is a valid date
     * @param val
     * @return {*}
     */
    static isDate(val) {
        const d = new Date(val);
        return d instanceof Date && !isNaN(d.getTime()) && moment(d).isValid();
    }

    /**
     * @description If value is a valid email address
     * @param val
     * @return {boolean}
     */
    static isEmail(val) { return schemaFields.EMAIL.REG_EXP.test(val); }

    /**
     * @description If value's length or value itself is larger than <min>
     * @param val
     * @param min
     * @return {boolean}
     */
    static min(val, min) { return this.isNumber(val) ? val >= min : val.length >= min; }

    /**
     * @description If value's length or value itself is not larger than <max>
     * @param val
     * @param max
     * @return {boolean}
     */
    static max(val, max) { return this.isNumber(val) ? val <= max : val.length <= max; }

    /**
     * @description If value matches the <regExp>
     * @param val
     * @param regExp
     * @return {boolean}
     */
    static regExp(val, regExp) { return new RegExp(regExp).test(val); }

    /**
     * @description Validator
     * @param input
     * @param validators
     * @return {*}
     */
    static validate(input, validators) {

        // access the value from the <path> (nested also)
        const deep_value = function(theObject, path, separator = '.') {
            try {
                separator = separator || '.';

                return path.replace('[', separator)
                    .replace(']','')
                    .split(separator)
                    .reduce((obj, property) => obj[property], theObject);

            } catch (err) { return undefined; }
        };

        // run validators
        return validators.map(validator => {
            const rules = Object.keys(validator.rules)
                .map(key => { return { name: key, value: validator.rules[key] } })
                .filter(x => x.value);

            // get the errors (if any)
            const errors = rules.map(rule => {
                const value = deep_value(input, validator.field);

                if (!value && rules.findIndex(x => x.name === 'required') >= 0) {
                    // does not exist but is required
                    return 'required';
                } else if (!value && rules.findIndex(x => x.name === 'required') === -1) {
                    // does not exist but is not required
                    return false;
                }

                switch (rule.name) {
                    case 'required': return this.isPresent(value) ? false : rule.name;
                    case 'objectId': return this.isObjectId(value) ? false : rule.name;
                    case 'date': return this.isDate(value) ? false : rule.name;
                    case 'email': return this.isEmail(value) ? false : rule.name;
                    case 'number': return this.isNumber(value) ? false : rule.name;
                    case 'boolean': return this.isBoolean(value) ? false : rule.name;
                    case 'min': return this.min(value, rule.value) ? false : rule.name;
                    case 'max': return this.max(value, rule.value) ? false : rule.name;
                    case 'regExp': return this.regExp(value, rule.value) ? false : rule.name;
                    case 'lowercase': return this.isLowerCase(value) ? false : rule.name;
                    case 'uppercase': return this.isUpperCase(value) ? false : rule.name;
                    default: return false;
                }
            }).filter(e => e);

            // return the code
            const successCode = {
                name: 'VALIDATION_PASSED',
                status: 200,
                success: true
            };
            return errors.length ? codeGenerator.inputValidation(validator.field, errors[0]) : successCode;
        }).filter(x => x).sort((a,b) => (a.success > b.success) ? 1 : ((b.success > a.success) ? -1 : 0))[0];

    }

};