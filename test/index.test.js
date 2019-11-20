const gql = require('../index')
const path = require('path')


describe('gql-js', function() {
    this.timeout(0)
    it('test', async () => {
        gql.init({
            defaults: 'gql1',
            basePath: path.join(__dirname, 'gql'),
            clients: {
                gql1: {
                    pattern: 'gql1/**',
                    url: 'http://localhost:8003/graphql'
                },
                gql2: {
                    pattern: '',
                    url: 'http://localhost:8001/graphql'
                }
            }
        })

        const client = gql.get('gql1')
        const getAuthor = client(`query getAuthor($id: Int!) {
            author(id: $id) {
                name
                posts {
                    id
                    title
                }
            }
        }`)

        const data = await getAuthor({ id: 1 })
        console.log(data)

        const p = path.join(__dirname, 'gql/gql1/index.gql')
        const client2 = gql.match(p)
        const getAuthor2 = await client2(`query getAuthor($id: Int!) {
            author(id: $id) {
                name
                posts {
                    id
                    title
                }
            }
        }`)
        const data2 = await getAuthor2({ id: 2 })
        console.log(data2)
    })
})
