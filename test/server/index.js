/**
 * @file server
 * @author ielgnaw(wuji0223@gmail.com)
 */

// import 'babel-register';
// import 'babel-polyfill';
import http from 'http';
import Koa from 'koa';
import graphQLHTTP from 'koa-graphql';
import mount from 'koa-mount';
import convert from 'koa-convert';
import bodyparser from 'koa-bodyparser';
import json from 'koa-json';
import onerror from 'koa-onerror';

import { getIP } from './util';
import { routes, allowedMethods } from './router/config';
import { getSchema } from './graphql';

const PORT = 8003;

const app = new Koa();

// const executableSchema = makeExecutableSchema({
//     typeDefs: readFileSync(join(__dirname, './test.graphql'), 'utf-8'),
//     // resolvers: {
//     //     Query: {
//     //         user: (_, args) => data[args.id]
//     //     }
//     // }
// });
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});
// curl -XPOST -H 'Content-Type:application/graphql'  -d '{__schema { queryType { name, fields { name, description} }}}' http://localhost:8001/graphql
app.use(mount('/graphql', convert(graphQLHTTP({
    schema: getSchema(),
    pretty: true,
    graphiql: true
}))));

app.use(convert.compose(routes));
app.use(convert.compose(allowedMethods));

app.use(convert(bodyparser()));
app.use(convert(json()));

onerror(app);
app.on('error', (err, ctx) => {
    console.log(err);
});


const server = http.createServer(app.callback());
server.listen(PORT);

server.on('error', error => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof PORT === 'string' ? ('Pipe ' + PORT) : 'Port ' + PORT;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', () => {
    const addr = server.address();
    console.log(`\nGraphQL Server is now running on http://localhost:${addr.port}/graphql `
        + `or http://${getIP()}:${addr.port}/graphql`);
    console.log(`\nShow Schema: http://localhost:${addr.port}/schema or http://${getIP()}:${addr.port}/schema`);
    console.log('\nIntrospectionQuery:');
    console.log(`curl -XPOST -H \'Content-Type:application/graphql\' -d `
        + `\'{__schema {queryType {name fields {name description}} mutationType {name fields {name description}}}}\' `
        + `http://${getIP()}:${addr.port}/graphql`);

    console.log('\nQuery Example:');
    console.log(`curl -XPOST -H \'Content-Type:application/graphql\' -d `
        + `\'{posts {title votes author {id name}}}\' `
        + `http://${getIP()}:${addr.port}/graphql`);

    console.log('\nMutation Example:');
    console.log(`curl -XPOST -H \'Content-Type:application/graphql\' -d `
        + `\'mutation {upvotePost(postId: 2) {id title votes}}\' `
        + `http://${getIP()}:${addr.port}/graphql`);
});
