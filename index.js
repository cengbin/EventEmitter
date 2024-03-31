/**
 * @author Bin.zeng
 * @date 2023-10-08 00:10:11
 * @email 596659597@qq.com
 * 参考：
 * https://github.com/primus/eventemitter3
 * https://github.com/mqyqingfeng/EventEmitter
 * https://www.runoob.com/nodejs/nodejs-event.html
 * */

/**
 * 验证是否是有效的侦听者函数
 * */
function isValidListener(listener) {
  return typeof listener === 'function'
}

/**
 * 为指定事件添加侦听器
 * @param  {EventEmitter} emitter 事件发射器实例
 * @param  {String}       event 事件名
 * @param  {Function}     fn 侦听函数
 * @param  {*}            context 执行侦听函数的上下文
 * @param  {Boolean}      once 指定监听器是否为一次性监听器
 * @return {EventEmitter} emitter
 * */
function addListener(emitter, event, fn, context, once) {
  if (!isValidListener(fn))
    throw  new TypeError("listener 必须是一个函数！")

  const listener = {
    fn,
    context,
    once,
  }

  const listeners = emitter._events[event] = (emitter._events[event] || [])

  listeners.push(listener)

  return emitter
}

/**
 * EventEmitter 事件发射器
 *
 * 继承自 EventEmitter 类，类的实例即是被观察者，可实现观察者模式。
 *
 * 全局创建 EventEmitter 实例，用作事件调度中心，可实现发布/订阅模式。
 * */
class EventEmitter {

  constructor() {
    this._events = {}
    // 订阅事件
    this.subscribe = this.on
    // 订阅事件，该事件只能被执行一次
    this.subscribeOnce = this.once
    // 发布事件
    this.publish = this.emit
    // 取消订阅事件
    this.unsubscribe = this.off
  }

  /**
   * 侦听事件
   * @param  {String} event 事件名称
   * @param  {Function} listener 侦听器函数
   * @param  {*} [context] 调用侦听器的上下文对象
   * @return {EventEmitter} `this`
   * @example
   *
   * emitter.subscribe('request_before', func)
   *
   * */
  on(event, listener, context) {
    return addListener(this, event, listener, context || this, false)
  }

  /**
   * 侦听事件，该事件只能被执行一次
   * */
  once(event, listener, context) {
    return addListener(this, event, listener, context || this, true)
  }

  /**
   * 派发事件
   * @param  {String} event 事件名称
   * @param  {*} [arguments] 传入侦听器函数的参数
   * @return {EventEmitter} `this`
   * */
  emit(event) {
    const listeners = this._events[event]
    if (listeners) {
      const len = arguments.length
      const args = new Array(len - 1)

      for (let j = 1; j < len; j++) {
        args[j - 1] = arguments[j]
      }

      for (let i = 0; i < listeners.length; i++) {
        let listener = listeners[i]

        if (listener.once) {
          this.off(event, listener.fn)
          i--
        }

        listener.fn.apply(listener.context, args)
      }
    }

    return this
  }

  /**
   * 移除事件
   * @param {String} event 事件名
   * @param {Function} [listener] 侦听器函数
   * */
  off(event, listener) {
    const listeners = this._events[event]
    if (!listeners) return

    if (!listener) {
      // 移除所有事件侦听器
      delete this._events[event]
    } else {
      for (let l = listeners.length - 1; l >= 0; l--) {
        if (listeners[l].fn === listener) {
          listeners.splice(l, 1)
          break
        }
      }
    }

    return this
  }

  /**
   * 返回指定事件的监听器数组
   * @param {String} event 事件名
   * @return {Array} 监听器数组
   * */
  listeners(event) {
    return event ? this._events[event] : null;
  }
}

export default EventEmitter