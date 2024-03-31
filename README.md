# EventEmitter 事件发射器

## 简介

EventEmitter 的核心就是事件触发与事件监听器功能的封装。

继承自 EventEmitter 类，类的实例即是被观察者，可实现观察者模式。

全局创建 EventEmitter 实例，用作事件调度中心，可实现发布/订阅模式。

## 使用

```
import EventEmitter from '@zengbin/eventemitter'
```

## API

### EventEmitter 类

|方法|描述|
|---|---|
|subscribe / on|侦听事件|
|subscribeOnce / once|侦听事件，该事件只能被执行一次|
|unsubscribe / off|移除事件|
|publish / emit|派发事件|
|listeners|返回指定事件的监听器数组|

## 示例代码

实现发布/订阅模式

```
import EventEmitter from './EventEmitter.js'

// 创建事件调度中心
let eventChannel = new EventEmitter()

// request_before事件 订阅者1
let subscribe1 = (config, data) => {
    console.log('我是Subscriber 1，监听到了请求发送之前的事件, ', config, data)
}

// request_before事件 订阅者2
let subscribe2 = (config, data) => {
    console.log('我是Subscriber 2，监听到了请求发送之前的事件, ', config, data)
}

// request_before事件 订阅者3
let subscribe3 = (config, data) => {
    console.log('我是Subscriber 3，监听到了请求发送之前的事件, ', config, data)
    eventChannel.unsubscribe('request_before', subscribe3)
}

// 订阅者 -> 去事件调度中心"订阅事件"
eventChannel
    .subscribe('request_before', subscribe1)
    .subscribeOnce('request_before', subscribe2)
    .subscribe('request_before', subscribe3)

// 发布者 -> 去事件调度中心"发布事件"
eventChannel.publish('request_before', {url: 'a.com', method: 'get'}, 1)
eventChannel.publish('request_before', {url: 'b.com', method: 'post'}, 2)
eventChannel.publish('request_before', {url: 'c.com', method: 'delete'}, 3)
```