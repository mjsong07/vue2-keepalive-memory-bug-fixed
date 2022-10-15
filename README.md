#  vue2的keepalive内存泄露与修复
本例子可以复现keepalive内存泄露问题
# 重现步骤
1. npm install  进行安装
2. npm run serve  运行
3. 打开浏览器 the http://localhost:8080/
4. 点击新增按钮创建组件a1
5. 点击新增按钮创建组件a2
6. 点击新增按钮创建组件a3
7. 点击新增按钮创建组件a3 ， 当前内存使用大概 330mb
8. 点击组件a4的x删除组件 ，但是内存依然是 330mb
9. 查看内存使用并没有减少, 这时候内存泄露了
# 期望
点击组件a4的x删除组件 ，内存应该减去80mb，剩下250mb
# 实际情况
内存使用依然是330mb.
# 其他描述
当前点击每个新增按钮，内存都会增加80mb，重复点击4次，内存大概是330mb
当点击组件a4的关闭时候，内存应该减去80mb，剩下250mb，但是实际还是330mb.
你可以查看gif 动图来重新问题。
# 内存报告分析
通过谷歌浏览器的内存报告分析，我们可以看到，
组件a3的a3-component.componentInstance.$vnode.parent.componentOptions.children[0]  居然是 组件a4，由于有这个引用，导致a4不能释放。

# 修复这个问题
通过修改代码 vue2.7.12 -> keepalive.js -> render() 
地址: src\core\components\keep-alive.ts
代码行数: line 127 加入下面修复的代码.
```js
 //mounted，repair the keepalive memory bug code
    for (const key in this.cache) {
      const entry = this.cache[key]
      if (entry && vnode && entry.tag && entry.tag !== vnode.tag ) { 
        entry.componentInstance.$vnode.parent.componentOptions.children = []
        entry.componentInstance.$vnode.parent.elm = null
      }
    }
```
通过上面代码，每次执行keepalive的渲染方法，都会重新初始化组件间的错误引用。
详细请访问掘金 https://juejin.cn/post/7153186266300252168

实际代码整合到 public的cdn文件夹中，可以通过切换不同cdn对比效果
```html 
    <!-- 原有vue2.16.14版本 -->
    <script src="/cdn/vue-2.6.14/dist/vue.js"></script>
    <!-- 调整源码后的 版本,修复引用问题，支持sourcemap调试  -->
     <script src="/cdn/vue-2.6.14/dist_fixed_bug/vue.js"></script> 
```

# 作者博客
https://juejin.cn/user/2972704795802653