var endsl = /\/$/,
  bgnsl = /^\//,
  updir = /\/?[^\.\/]*\/\.\./,
  cwdir = /\/\.\//

export function joinPath(...paths: string[]): string {
  let x = paths.length
  let p = paths[x - 1].match(endsl) ? '/' : ''

  while (x--) {
    p = (!x || paths[x].match(bgnsl) ? '' : '/') + paths[x].replace(endsl, '') + p
  }

  while (updir.test(p)) p = p.replace(updir, '')
  while (cwdir.test(p)) p = p.replace(cwdir, '/')

  return p
}
