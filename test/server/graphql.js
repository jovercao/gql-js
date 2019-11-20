/**
 * @file graphql 相关
 * @author ielgnaw(wuji0223@gmail.com)
 */

import {readFileSync} from 'fs';
import {join} from 'path';
import casual from 'casual-browserify';
import {find, filter} from 'lodash';

import {makeExecutableSchema, addMockFunctionsToSchema, MockList} from 'graphql-tools';

// addMockFunctionsToSchema({schema: executableSchema, mocks: {
//     Int: () => casual.integer(1, 10000),
//     Float: () => 22.1,
//     String: () => 'Hello',
//     Task: () => ({text: casual.sentence}),
//     Author: () => ({
//         name: casual.name,
//         posts: () => new MockList(3, author => ({author: author.id})),
//     }),
// }});
const authors = [
    {id: 1, name: 'Firede', onlyForEndpoint: 'onlyForEndpoint'},
    {id: 2, name: 'ielgnaw', onlyForEndpoint: 'onlyForEndpoint'},
    {id: 3, name: 'Zhai wanli', onlyForEndpoint: 'onlyForEndpoint'},
    {id: 4, name: 'Liang', onlyForEndpoint: 'onlyForEndpoint'},
];

const posts = [
    {id: 1, authorId: 1, title: 'postTitle1', votes: 4 },
    {id: 2, authorId: 2, title: 'postTitle2', votes: 1 },
    {id: 3, authorId: 1, title: 'postTitle3', votes: 2 },
    {id: 4, authorId: 3, title: 'postTitle4', votes: 3 },
    {id: 5, authorId: 4, title: 'postTitle5', votes: 2 },
    {id: 6, authorId: 2, title: 'postTitle6', votes: 1 },
];

export const resolveFunctions = {
    Query: {
        posts() {
            return posts;
        },
        author(_, {id}) {
            return find(authors, {id: id});
        }
    },
    Mutation: {
        upvotePost(_, {postId}) {
            const post = find(posts, {id: postId});
            if (!post) {
                throw new Error(`Couldn't find post with id ${postId}`);
            }
            post.votes += 1;
            return post;
        }
    },
    Author: {
        posts(author) {
            return filter(posts, { authorId: author.id });
        }
    },
    Post: {
        author(post) {
            return find(authors, { id: post.authorId });
        }
    }
};

const executableSchema = makeExecutableSchema({
    typeDefs: readFileSync(join(__dirname, './data/test.graphql'), 'utf-8'),
    resolvers: resolveFunctions
});

export function getSchema() {
    return executableSchema;
}
