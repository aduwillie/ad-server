const Validator = require('./validator');

class RouteValidator extends Validator {
    constructor() {
        const func = (route) => {
            if (!route.path || !route.method || !route.handler) {
                this.errorMessage = 'Invalid route config';
                return false;
            }
            return true;
        };
        super(func);
    }
}

module.exports = RouteValidator;
