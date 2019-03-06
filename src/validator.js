class Validator {
    constructor(func) {
        this.func = func;
        this.errorMessage = undefined;
    }

    validate(param) {
        return this.func(param);
    }
}

module.exports = Validator;
