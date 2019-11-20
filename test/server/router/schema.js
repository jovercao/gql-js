/**
 * @file schema 路由
 * @author ielgnaw(wuji0223@gmail.com)
 */

import KoaRouter from 'koa-router';
import {join, dirname, basename} from 'path';
import {renameSync, statSync, createReadStream} from 'fs';
import {printSchema} from 'graphql/utilities/schemaPrinter';

import {getSchema} from '../graphql';

const router = new KoaRouter({
    prefix: '/schema'
});

router.get('/', async (ctx, next) => {
    const TYPE = '/schema';
    try {
        ctx.response.set('Content-type', 'text/plain');
        ctx.body = printSchema(getSchema());
    }
    catch (e) {
        console.log(e);
        ctx.status = 500;
        ctx.body = {
            type: TYPE,
            status: 1,
            statusInfo: '系统异常，请稍候再试'
        };
    }
});

router.post('/', async (ctx, next) => {
    const TYPE = '/schema';

    // post 参数获取
    // ctx.request.body.KEY
    console.log('postArgs', ctx.request.body);

    try {
        // do something
        ctx.body = {
            type: TYPE,
            status: 0,
            data: {
                x: 1,
                postArgs: ctx.request.body
            }
        };
    }
    catch (e) {
        console.log(e);
        ctx.status = 500;
        ctx.body = {
            type: TYPE,
            status: 1,
            statusInfo: '系统异常，请稍候再试'
        };
    }
});

export default router;
