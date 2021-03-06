const _ = require('lodash');
const codes = require('../assets/system-codes.asset');
const Joi = require('joi');

/**
 * @description Generates a validation error from Joi output
 * @param error
 */
exports.validationError = function (error) {
    return {
        name: 'VALIDATION_ERROR',
        message: !!error.details ? _.capitalize(error.details[0].message.replace(/"/g, "")) : error,
        success: false,
        status: 400
    };
};

/**
 * @description: Returns a new error based on the input
 * @param input
 * @param optional
 * @returns {Error}
 */
exports.prepareError = function (input, optional = false) {
    let error = new Error();
    let at = undefined;

    // if (input && input.port) {
    //     const svc = _.find(services, { port: input.port });
    //     at = svc ? svc.id : input.port;
    // }

    input = input ? input.code === 'ECONNREFUSED' ? codes.SERVICE.UNREACHABLE : input : input;

    error.name = input ? input.name : codes.UNDEFINED.name;
    error.status = input ? input.status : codes.UNDEFINED.status;
    error.message = input ? input.message || null : codes.UNDEFINED.message;
    error.success = input ? input.success || false : codes.UNDEFINED.success;
    error.errorAt = input ? input.errorAt || at : codes.UNDEFINED.at;

    return error;
};