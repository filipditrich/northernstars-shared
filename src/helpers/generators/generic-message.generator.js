exports.inputValidate = (name, error) => {
    return `Field ${formatName(name)} did not meet the following validation requirement: ${formatName(error)}`;
};

exports.duplicate = (name) => {
    return `Duplicate value in '${formatName(name)}' field.`;
};

exports.unique = (name) => {
    return `${formatName(name)} must be of a unique value.`;
};

exports.invalid = (name) => {
    return `The provided ${formatName(name)} is not valid.`
};

exports.notFound = (name) => {
    return `The specified ${formatName(name)} was not found.`;
};

exports.multipleNotFound = (name) => {
    return `No ${formatName(name)} was found.`;
};

exports.missing = (name) => {
    return `${formatName(name)} is missing.`;
};

exports.minLength = (name, minLength) => {
    return `${formatName(name)} must be at least ${minLength} characters long.`
};

exports.maxLength = (name, maxLength) => {
    return `${formatName(name)} may only be ${maxLength} characters long.`
};

exports.required = (name) => {
    return `${formatName(name)} is required.`;
};

exports.fail = (name) => {
    return `${formatName(name)} failed.`;
};

exports.success = (name) => {
    return `${formatName(name)} was successful.`;
};

exports.create = (name) => {
    return `${formatName(name)} has been created successfully.`
};

exports.update = (name) => {
    return `${formatName(name)} has been updated successfully.`
};

exports.delete = (name) => {
    return `${formatName(name)} has been deleted successfully.`
};

function formatName(name) {
    return name.split("_").filter(x => x !== "_").join(" ").replace(/\b\w/g, l => l.toUpperCase());
}