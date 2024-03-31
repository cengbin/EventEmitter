import EventEmitter from '../dist/EventEmitter'

describe('EventEmitter 模块测试', () => {
  test('eventEmitter.emit()测试', () => {
    const eventEmitter = new EventEmitter()
    eventEmitter.on('test', (data) => {
      console.log('触发了test侦听函数，data=', data)
    })
    eventEmitter.emit('test', '123')
  })

  test('eventEmitter.publish()测试', () => {
    // 创建事件调度中心
    const eventChannel = new EventEmitter()
    const subscribe1 = (config, data) => {
      console.log('我是Subscriber 1，监听到了 click 事件, ', config, data)
    }
    const subscribe2 = (config, data) => {
      console.log('我是Subscriber 2，监听到了 click 事件, ', config, data)
    }
    const subscribe3 = (config, data) => {
      console.log('我是Subscriber 3，监听到了 click 事件, ', config, data)
      eventChannel.unsubscribe('request_before', subscribe3)
    }

    eventChannel
      .subscribe('click', subscribe1)
      .subscribeOnce('click', subscribe2)
      .subscribe('click', subscribe3)

    eventChannel.publish('click', { url: 'a.com', method: 'get' }, 1)
    eventChannel.publish('click', { url: 'b.com', method: 'post' }, 2)
    eventChannel.publish('click', { url: 'c.com', method: 'delete' }, 3)
  })

  test('eventEmitter.listeners()测试', () => {
    const eventEmitter = new EventEmitter()
    eventEmitter.on('test', (data) => {
      console.log('触发了test侦听函数，data=', data)
    })
    console.log(eventEmitter.listeners('test'))
    console.log(eventEmitter.listeners('text'))
  })
})
