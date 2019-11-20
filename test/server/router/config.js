/**
 * @file router config
 * @author ielgnaw(wuji0223@gmail.com)
 */

import KoaRouter from 'koa-router';
import schema from './schema';

const routes = [];
const allowedMethods = [];

[schema].forEach(router => {
    routes.push(router.routes());
    allowedMethods.push(router.allowedMethods());
});

export {routes, allowedMethods};
