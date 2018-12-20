const _ = require('lodash');
let routes, settings;

/**
 * @description Imports Routes
 * @param imported
 */
exports.importRoutes = (imported) => { routes = imported; };

/**
 * @description Imports Settings
 * @param imported
 */
exports.importSettings = (imported) => { settings = imported };

/**
 * @description Generic Route Handler
 * @param req
 * @param res
 * @param next
 */
exports.genericRouteHandler = (req, res, next) => {

    const route = _.find(exports.routes, _route => {
        return (new RegExp(_route.regexp)).test(req.path) && _route.method.toUpperCase() === req.method.toUpperCase();
    });

    if (route) {

        // get all params
        const params = (new RegExp(route.regexp)).exec(req.path);
        params.shift();

        // assign params and its values to the request
        route.path.split('/').filter(x => x.startsWith(':')).forEach((param, i) => {
            param = param.replace(/\((.*?)\)/, '').replace('?', '').replace(':', '');
            req.params[param] = params[i];
        });


        const middleware = [];
        // if the bypass secret is valid bypass all middlewares
        if (req.headers['x-bypass'] !== settings.secret) {
            // run all middleware functions
            _.each(route.middleware, _middleware => {
                if (_middleware) {
                    middleware.push(_middleware(req, res, next));
                }
            });
        }

        Promise.all(middleware).then(() => {

            // run the controller function
            try {
                route.controller(req, res, next);
            } catch (error) {
                return next(error);
            }

        }).catch(error => {
            return next(error);
        });

    } else {
        next();
    }

};