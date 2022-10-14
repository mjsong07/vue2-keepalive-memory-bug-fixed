/* @flow */

import { isRegExp, remove } from 'shared/util'
import { getFirstComponentChild } from 'core/vdom/helpers/index'
//单个缓存
type CacheEntry = {
  name: ?string;
  tag: ?string;
  componentInstance: Component;
};
//map 多个缓存
type CacheEntryMap = { [key: string]: ?CacheEntry };

function getComponentName (opts: ?VNodeComponentOptions): ?string {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}
//遍历当前所有 缓存信息， vue实例 在缓存中的关系
function pruneCache (keepAliveInstance: any, filter: Function) {
  // console.log("pruneCache所有信息...")
  const { cache, keys, _vnode } = keepAliveInstance //keepAliveInstance 是当前this keepalive 整个对象
  for (const key in cache) {
    const entry: ?CacheEntry = cache[key]
    if (entry) {
      const name: ?string = entry.name
      if (name && !filter(name)) { // 这里执行 传入方法过滤的逻辑 ，参数为当前组件 name ，!filter(name) 指的是不在include列表里的的name
        pruneCacheEntry(cache, key, keys, _vnode) //key为缓存实例的唯一值
      }
    }
  }
}
//移除单条 当前缓存信息，执行销毁和缓存信息
function pruneCacheEntry (
  cache: CacheEntryMap,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const entry: ?CacheEntry = cache[key]
  if (entry && (!current || entry.tag !== current.tag)) {
    entry.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

const patternTypes: Array<Function> = [String, RegExp, Array]

export default {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  methods: {
    //缓存节点 基于 render方法执行时，缓存的vnodeToCache 进行实际缓存map的加入
    cacheVNode() {
      const { cache, keys, vnodeToCache, keyToCache } = this
      if (vnodeToCache) {
        // console.log("vnodeToCache不为空，进行缓存")
        const { tag, componentInstance, componentOptions } = vnodeToCache
        //加入缓存map 
        cache[keyToCache] = {
          name: getComponentName(componentOptions),
          tag,
          componentInstance,
        }
        //同时维护 LRU的最新状态，在尾部push的为最新活动状态
        keys.push(keyToCache)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) { //一次只加入一条，所以超出只需要删除一条。默认删最老不活跃的。
          // console.log("触发max逻辑，删除头部一条不活跃实例")
          pruneCacheEntry(cache, keys[0], keys, this._vnode)  //keys[0]为最前面不活跃的一条。
        } 
        this.vnodeToCache = null
        this.keyToCache = null
      }
    }
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
    this.vnodeToCache = Object.create(null)
    this.keyToCache = null
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    console.log("keepalive mounted，2.16.14修复keepalive 组件parent引用问题")
    this.cacheVNode() // 第一次页面加载完，缓存当前实例
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  updated () {
    // 当触发路由变化，执行更新的函数时，进行缓存当前节点
    this.cacheVNode()
  },

  render () {
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot) 
    
    //修复缓存列表问题
    for (const key in this.cache) {
      const entry: ?CacheEntry = this.cache[key]
      if (entry && vnode && entry.tag && entry.tag !== vnode.tag ) { //如果当前的缓存对象不为空 并且 缓存与当前加载不一样
        entry.componentInstance.$vnode.parent.componentOptions.children = []
        entry.componentInstance.$vnode.parent.elm = null
      }
    }

    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) { //如果缓存map 里已经包含 直接取出
        // console.log("有缓存-直接取",key)
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        // console.log("没缓存",key,"设置vnodeToCache")
        // delay setting the cache until update
        this.vnodeToCache = vnode
        this.keyToCache = key
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
