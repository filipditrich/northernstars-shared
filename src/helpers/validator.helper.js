const schemaFields = require('../assets/schema-fields.asset');
const codeGenerator = require('./generators/generic-code.generator');

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
    static isDate(val) { return moment(val).isValid(); }

    /**
     * @description If value's length is larger than <min>
     * @param val
     * @param min
     * @return {boolean}
     */
    static min(val, min) { return val.length >= min; }

    /**
     * @description If value's length is not larger than <max>
     * @param val
     * @param max
     * @return {boolean}
     */
    static max(val, max) { return val.length <= max; }

    /**
     * @description If value matches the <regExp>
     * @param val
     * @param regExp
     * @return {boolean}
     */
    static regExp(val, regExp) { return new RegExp(regExp).test(val); }

    validate(input, validators) {

        const deep_value = function(obj, path) {
            let val = false;
            for (let i = 0, _path = path.split('.'), len = _path.length; i < len; i++) {
                val = obj[_path[i]];
            }
            return val || '';
        };

        // run validators
        return validators.map(validator => {
            const value = deep_value(input, validator.field);
            const rules = Object.keys(validator.rules)
                .map(key => { return { name: key, value: validator.rules[key] } })
                .filter(x => x.value);

            const errors = rules.map(rule => {
                switch (rule.name) {
                    case 'required': return inputValidator.isPresent(value) ? false : rule.name;
                    case 'objectId': return inputValidator.isObjectId(value) ? false : rule.name;
                    case 'date': return inputValidator.isDate(value) ? false : rule.name;
                    case 'number': return inputValidator.isNumber(value) ? false : rule.name;
                    case 'boolean': return inputValidator.isBoolean(value) ? false : rule.name;
                    case 'min': return inputValidator.min(value, rule.value) ? false : rule.name;
                    case 'max': return inputValidator.max(value, rule.value) ? false : rule.name;
                    case 'regExp': return inputValidator.regExp(value, rule.value) ? false : rule.name;
                    case 'lowercase': return inputValidator.isLowerCase(value) ? false : rule.name;
                    case 'uppercase': return inputValidator.isUpperCase(value) ? false : rule.name;
                    default: return false;
                }
            }).filter(e => e);

            // return error code
            const errorCode = codeGenerator.inputValidation(validator.field, errors[0]);
            const successCode = {
                name: 'VALIDATION_PASSED',
                status: 200,
                success: true
            };
            return errors.length ? errorCode : successCode;
        }).filter(x => x)[0];
    }

};