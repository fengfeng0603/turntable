# turn-table 转盘

*自定义表盘使用到clip-path属性(已添加兼容性前缀)，请充分了解此[兼容性]问题(https://caniuse.com/#search=clip-path)*


完全基于css3的转盘调用库，完美兼容rem，百分比等各种移动端适配，支持通过css自定义样式


## feature
- 完全的dom渲染，可以灵活的自定义样式。
- 支持两种类型转盘。1.整个奖盘为一张图片（默认）。2.支持自定义表盘。
- 转盘角度模糊匹配奖项区域，更加逼真
- 可自定义 奖品匹配key值

## example
``` js
// 引入 TurnTable 类
import { TurnTable } from '@/libs/turn-table'

// 
let prize = ['jp0','jp1','jp2','jp3','jp4','jp5',]
let turnTable = TurnTable({
    el: '', 
    prize: prize
})

// 表盘初始化 (自定义绘制表盘时，init不可省略)。type为image时，可省略
turnTable.init() 

// 开奖方法，支持回调
turnTable.goBomb('jp4',cb)

 ```

## api

#### TurnTable(config)

``` js
TurnTable({
    el: '', // 必填 string | Element
    prize: [{
        prizeId : '奖品唯一标识',
        text: '填充在表盘的文字',
        color: '表盘对应扇形背景色' ,
    }], // 必填 array
    type: '', // image | auto  表盘是一张背景图 || 需要自动生成
    id: 'prizeId', // 自定义 开奖时的唯一标识的 key值

})
```

#### instance.init()  

当表盘类型选择为 auto 时，为达到同步显示效果，此init方法需手动调用


## 其他

classname
``` js
- tt-sector  // 扇形区域
- tt-sector-text // 扇形区域内 text
- tt-sector-custom // 预留扇形内自定义区域
```

