const graphql = require('graphql.js')
const path = require('path')

const instances = {}

let defaultInstance

const matchMapps = []

function properPattern(pattern, basePath) {
    let reg
    if (basePath) {
        reg = path.join(basePath, pattern)
    } else {
        reg = pattern
    }

    // 为了兼容windows,路径还要支持反斜杠 \
    reg = reg.replace(/\\|\//g, '(\\\\|/)')
        .replace(/\*\*/g, '(.+)')
        .replace(/\*/g, '([^\\\\/.])')
    return new RegExp(reg, 'i')
}

function init(config) {
    Object.entries(config.clients).forEach(([name, { url, pattern, ...cfg }]) => {
        const instance = instances[name] = graphql(url, cfg)
        if (pattern) {
            if (typeof pattern === 'string') {
                pattern = properPattern(pattern, config.basePath)
            }
            matchMapps.push({
                pattern,
                instance
            })
        }
    })
    defaultInstance = instances[config.defaults]
}

function get(name) {
    if (name) {
        const instance = instances[name]
        if (!instance) {
            throw new Error(`未找到名称为${name}的实例，请确定已经使用 gql.init(cfg)进行配置该实例。`)
        }
        return instance
    }
    return defaultInstance
}

function match(path) {
    for (const { pattern, instance } of matchMapps) {
        if (pattern.test(path)) {
            return instance
        }
    }
    return defaultInstance
}

module.exports = {
    init,
    get,
    match
}
