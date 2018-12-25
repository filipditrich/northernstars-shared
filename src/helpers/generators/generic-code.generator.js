const messageGenerator = require('./generic-message.generator');

exports.inputValidation = (field, error) => {
    return {
        name: `FIELD_${field.toUpperCase()}_FAILED_FOR_${error.toUpperCase()}`,
        message: messageGenerator.inputValidate(field, error),
        status: 422,
        success: false
    }
};

exports.duplicate = (field) => {
    return {
        name: `${field.toUpperCase()}_DUPLICATE`,
        message: messageGenerator.duplicate(field),
        status: 400,
        success: false
    }
};

exports.unique = (field) => {
    return {
        name: `${field.toUpperCase()}_UNIQUE`,
        message: messageGenerator.unique(field),
        status: 400,
        success: false
    }
};

exports.invalid = (field) => {
    return {
        name: `${field.toUpperCase()}_INVALID`,
        message: messageGenerator.invalid(field),
        status: 422,
        success: false
    }
};

exports.notFound = (field) => {
    return {
        name: `${field.toUpperCase()}_NOT_FOUND`,
        message: messageGenerator.notFound(field),
        status: 404,
        success: false
    }
};

exports.multipleNotFound = (field) => {
    return {
        name: `NO_${field.toUpperCase()}S_FOUND`,
        message: messageGenerator.multipleNotFound(field),
        status: 404,
        success: false
    }
};

exports.missing = (field) => {
    return {
        name: `${field.toUpperCase()}_MISSING`,
        message: messageGenerator.missing(field),
        status: 400,
        success: false
    }
};

exports.required = (field) => {
    return {
        name: `${field.toUpperCase()}_REQUIRED`,
        message: messageGenerator.required(field),
        status: 400,
        success: false
    }
};

exports.minLength = (field, minLength) => {
    return {
        name: `${field.toUpperCase()}_MIN_LENGTH`,
        message: messageGenerator.minLength(field, minLength),
        status: 422,
        success: false
    }
};

exports.maxLength = (field, maxLength) => {
    return {
        name: `${field.toUpperCase()}_MAX_LENGTH`,
        message: messageGenerator.maxLength(field, maxLength),
        status: 422,
        success: false
    }
};

exports.fail = (field, status = 400) => {
    return {
        name: `${field.toUpperCase()}_FAILED`,
        message: messageGenerator.fail(field),
        status: status,
        success: false
    }
};

exports.success = (field) => {
    return {
        name: `${field.toUpperCase()}_SUCCESSFUL`,
        message: messageGenerator.success(field),
        status: 200,
        success: true
    }
};

exports.create = (field) => {
    return {
        name: `${field.toUpperCase()}_CREATE_OK`,
        message: messageGenerator.create(field),
        status: 201,
        success: true
    }
};

exports.update = (field) => {
    return {
        name: `${field.toUpperCase()}_UPDATE_OK`,
        message: messageGenerator.update(field),
        status: 200,
        success: true
    }
};

exports.delete = (field) => {
    return {
        name: `${field.toUpperCase()}_DELETE_OK`,
        message: messageGenerator.delete(field),
        status: 200,
        success: true
    }
};