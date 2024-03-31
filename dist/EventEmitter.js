(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EventEmitter = factory());
})(this, (function () { 'use strict';

  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

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
    return typeof listener === 'function';
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
    if (!isValidListener(fn)) throw new TypeError("listener 必须是一个函数！");
    var listener = {
      fn: fn,
      context: context,
      once: once
    };
    var listeners = emitter._events[event] = emitter._events[event] || [];
    listeners.push(listener);
    return emitter;
  }

  /**
   * EventEmitter 事件发射器
   *
   * 继承自 EventEmitter 类，类的实例即是被观察者，可实现观察者模式。
   *
   * 全局创建 EventEmitter 实例，用作事件调度中心，可实现发布/订阅模式。
   * */
  var EventEmitter = /*#__PURE__*/function () {
    function EventEmitter() {
      _classCallCheck(this, EventEmitter);
      this._events = {};
      // 订阅事件
      this.subscribe = this.on;
      // 订阅事件，该事件只能被执行一次
      this.subscribeOnce = this.once;
      // 发布事件
      this.publish = this.emit;
      // 取消订阅事件
      this.unsubscribe = this.off;
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
    return _createClass(EventEmitter, [{
      key: "on",
      value: function on(event, listener, context) {
        return addListener(this, event, listener, context || this, false);
      }

      /**
       * 侦听事件，该事件只能被执行一次
       * */
    }, {
      key: "once",
      value: function once(event, listener, context) {
        return addListener(this, event, listener, context || this, true);
      }

      /**
       * 派发事件
       * @param  {String} event 事件名称
       * @param  {*} [arguments] 传入侦听器函数的参数
       * @return {EventEmitter} `this`
       * */
    }, {
      key: "emit",
      value: function emit(event) {
        var listeners = this._events[event];
        if (listeners) {
          var len = arguments.length;
          var args = new Array(len - 1);
          for (var j = 1; j < len; j++) {
            args[j - 1] = arguments[j];
          }
          for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            if (listener.once) {
              this.off(event, listener.fn);
              i--;
            }
            listener.fn.apply(listener.context, args);
          }
        }
        return this;
      }

      /**
       * 移除事件
       * @param {String} event 事件名
       * @param {Function} [listener] 侦听器函数
       * */
    }, {
      key: "off",
      value: function off(event, listener) {
        var listeners = this._events[event];
        if (!listeners) return;
        if (!listener) {
          // 移除所有事件侦听器
          delete this._events[event];
        } else {
          for (var l = listeners.length - 1; l >= 0; l--) {
            if (listeners[l].fn === listener) {
              listeners.splice(l, 1);
              break;
            }
          }
        }
        return this;
      }

      /**
       * 返回指定事件的监听器数组
       * @param {String} event 事件名
       * @return {Array} 监听器数组
       * */
    }, {
      key: "listeners",
      value: function listeners(event) {
        return event ? this._events[event] : null;
      }
    }]);
  }();

  return EventEmitter;

}));
