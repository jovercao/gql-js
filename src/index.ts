import graphql, { GraphqlClient, GraphqlClientOptions } from '@jovercao/graphql.js'
import { joinPath } from './util'


const instances: Record<string, GraphqlClient> = {}

let defaultInstance: GraphqlClient

const matchMapps: { pattern: RegExp, instance: GraphqlClient }[] = []

function properPattern(pattern: string, basePath: string) {
    let reg
    if (basePath) {
        reg = joinPath(basePath, pattern)
    } else {
        reg = pattern
    }

    // 为了兼容windows,路径还要支持反斜杠 \
    reg = reg.replace(/\\|\//g, '(\\\\|/)')
        .replace(/\*\*/g, '(.+)')
        .replace(/\*/g, '([^\\\\/.])')
    return new RegExp(reg, 'i')
}

export type InitConfig = {
    /**
     * graphql匹配的基本路径
     */
    basePath?: string;
    default: string;
    clients: {
        [key: string]: {
            url: string;
            pattern: string | RegExp;
        } & GraphqlClientOptions
    }
}

let Config: InitConfig

export function init(config: InitConfig): Record<string, GraphqlClient> {
    const { basePath = '' } = config
    Object.entries(config.clients).forEach(([name, { url, pattern, ...cfg }]) => {
        const instance = instances[name] = graphql(url, cfg)
        if (pattern) {
            if (typeof pattern === 'string') {
                pattern = properPattern(pattern, basePath)
            }
            matchMapps.push({
                pattern,
                instance
            })
        }
    })
    defaultInstance = instances[config.default]
    Config = config
    return instances
}

export function get(name: string) {
    if (!Config) {
        throw new Error('您尚未初始化配置，请调用`gql.init(config)`进行初始化。')
    }
    if (name) {
        const instance = instances[name]
        if (!instance) {
            throw new Error(`未找到名称为${name}的实例，请确定已经使用 gql.init(cfg)进行配置该实例。`)
        }
        return instance
    }
    return defaultInstance
}

export function match(path: string) {
    if (!Config) {
        throw new Error('您尚未初始化配置，请调用`gql.init(config)`进行初始化。')
    }
    for (const { pattern, instance } of matchMapps) {
        if (pattern.test(path)) {
            return instance
        }
    }
    return defaultInstance
}

export default {
    init,
    get,
    match
}
