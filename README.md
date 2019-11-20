# gql-js

> 一个gql客户端工具库

## 特性

- gql客户端
- gql客户端实例管理工具，通过配置管理
- 与`@jovercao/gql-loader`配合使用达到可多连接多服务端的效果

## 使用方法

### 配置及客户端管理

```js
import gql from 'gql-js'

// 初始化配置
gql.init({
    // 默认客户端实例
    defaults: 'instance1',
    clients: {
        // 实例名称,可通过get方法获取
        instance1: {
            // 服务端地址
            url: 'http://localhost/graphql',
            // 使用JSON格式POST, 默认为true
            asJson: true
        }
    }
})

// instance1 为 `graphql.js` 实例， 具体使用请参考 https://github.com/f/graphql.js
// 通过配置名称获取
const instance1 = gql.getClient('instance1')
instance1(`query getUser($id: Int!) {
    user(id: $id) {
        name
        password
    }
}`, { id: 1 })

```

### 配合@jovercao/gql-loader使用

**webpack的loader配置：**

```js
{
  test: /\.(graphql|gql)$/,
  exclude: /node_modules/,
  use: {
    loader: '@jovercao/gql-loader'
  }
}
```

**项目结构：**

- src
  - gql
    - user ....................... 该目录下的gql文件将使用userInstance 实例
      - index.gql ........... 用户GQL查询定义
    - product.................... 该目录下的gql文件将使用 productInstance 实例
      - index.gql ...... 产品GQL查询定义
  - gqlInit.js ........... 客户端初始化JS
  - userSimple.js ... 调用JS

**初始化JS：**

```js
// # src/gqlInit.js
import gql from 'gql-js'

// 初始化配置
gql.init({
    // 默认客户端实例
    defaults: 'instance1',
    clients: {
        userInstance: {
            // 用于查找client的匹配字符串，亦可以使用正则表达式
            match: './src/instance/**',
            // 地址
            url: 'http://localhost/graphql',
            // 使用JSON格式POST, 默认为true
            asJson: true
        },
        productInstance: {
            // 用于查找client的匹配字符串，亦可以使用正则表达式
            match: './src/instance/**',
            // 地址
            url: 'http://localhost/graphql',
            // 使用JSON格式POST, 默认为true
            asJson: true
        }
    }
})
```

**GQL查询定义：**

```graphql
# src/user.gql

fragment userFields on User {
  name
  age
}

query get($name: String) {
  getUser(name: $name)
    ...userFields
  }
}

mutation update($user: InputUser!) {
  updateUser(input: $user) {
    ...userFields
  }
}
```

**调用JS：**

```js
// src/userDemo.js

import User from './gql/user/index.gql'
import Product from './gql/product/index.gql'


(async function demo() {
    const user = await User.get({ name: 'foo' })
    user.age = 20
    const updatedUser = await user.update({ user })
})()

```
