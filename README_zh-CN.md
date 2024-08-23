###  @samdy-chan/vue3-goto-top-or-bottom

##### Click on <a href="./README.md"> &lt;README. md&gt;  </a> to view the English version of the Usage Instructions.


- #### Preview（本组件使用效果预览图）

- 本组件使用过程中的 GIF 动态效果图（图片经过压缩，视觉可能会有所模糊）：

![本组件使用动态效果图](http://qiniu.sirurl.cn/my-npm-pkg-imgs/vue-goto-top-or-bottom_compressed.gif)




- #### Functional Description（功能描述）


##### @samdy-chan/vue3-goto-top-or-bottom 这个 vue3 自定义组件由作者 Samdy_Chan 独立开发。此组件的主要功能是根据父容器是否出现垂直滚动条来自动显示/隐藏 [滚动到顶部/底部] 图标，点击图标可直接或缓慢动画效果滚动到父容器或页面顶部/底部，其主要功能包括：

1)、本组件基于 Vite 5.3.1 + Vue 3.4.29 + TypeScript(TS) 5.2.2 构建打包，支持组件参数TS类型声明；
       本组件的[滚动到顶部/底部]图标文件和所有css样式代码都已经全部打包到生成的 js 文件中，并正常引用和使用，所以不会额外生成单独的图标图片文件及css样式文件；
       [滚动到顶部/底部]图标采用 png 透明图片，可通过组件参数如 
```html       
<GotoTopOrBottom :cssObj="{backgroundColor: '#2c8ce6'}" 
```
改变图标的颜色（默认为浅蓝色）。由于图片较小，为了方便，并在打包时将图片打包为 base64 编码格式，并在打包后的 js 文件中直接引用了此 base64 编码格式的图片；

2)、根据此组件父容器（HTML父标签元素）的内容如果超出了父容器的高度（需设置父容器css属性height或max-height），出现了垂直滚动条时（需设置父容器css属性overflow: auto或overflow-y: auto），会自动显示本组件（滚动到顶部/底部）箭头图标，点击图标可直接或缓慢动画效果滚动到父容器或页面顶部/底部；

3)、本组件会自动判断，如果滚动条已经滚动到父容器最顶部（包括手动拖动滚动条到顶部，或点击本组件[滚动到顶部]图标滚动到顶部），则会隐藏[滚动到顶部]图标，只显示[滚动到底部]图标。反之亦然，当滚动到底部时，只显示[滚动到顶部]图标；

4)、本组件的[滚动到顶部/底部]图标可以在父容器（当缺省 parentIsWindow 参数或值为 false）或页面（当 parentIsWindow 参数值为 true）范围内随意拖动移动，以便方便阅读父容器的内容，鼠标左键按住图标0.5秒，即可拖动移动图标；

5)、右击本组件的[滚动到顶部/底部]图标，在弹出的快捷菜单中点击[隐藏]菜单项，可在本次浏览中临时隐藏本组件的[滚动到顶部/底部]图标，以便方便阅读父容器的内容；

6)、使用本组件时，可设置传递 animateObj 对象参数是否开启缓慢滚动动效 animateObj.enable（默认true，开启），和滚动时长 animateObj.duration（默认300毫秒，建议保留此默认值，如果设置不当，可能会引起滚动卡顿不流畅），使用方法，例如：
```html
<GotoTopOrBottom :animateObj="{enable:true, duration: 300}" />
```
缺省不设置，默认就是开启滚动动效和滚动时长300毫秒；



- #### Installation（安装方法）


###### a）、For npm：


npm install @samdy-chan/vue3-goto-top-or-bottom --save

###### b）、For yarn：


yarn add @samdy-chan/vue3-goto-top-or-bottom

###### c）、For pnpm：


pnpm add @samdy-chan/vue3-goto-top-or-bottom --save



- #### Usage（使用方法）


- ###### 方法一：全局注册本组件


在 main.js / main.ts 中全局注册本组件，这样在其它所有组件及.vue页面中直接使用本组件标签<GotoTopOrBottom />即可，无需再导入，全局注册代码如下：

```javascript

// main.js or main.ts

import { createApp } from 'vue';

import App from './App.vue';

// 1、导入本组件（必须用默认导入方式）

import GotoTopOrBottom from '@samdy-chan/vue3-goto-top-or-bottom';

// 根据 App.vue 组件创建 Vue app 实例

const app = createApp(App);

// 2、全局注册本组件

app.use(GotoTopOrBottom);

// 挂载 Vue app 实例到 id 为 'app' 的 DOM 节点中

app.mount('#app');

```

- ###### 方法二：按需导入注册本组件（及组件Props参数说明）

  ###### 更详细的组件 Props 和 Events 使用说明，详见：Props & Events Instructions（参数及自定义事件使用说明） 部分


在每个需要使用本组件的.vue文件中都要导入本组件（必须用分别导入方式）：

```javascript
// 1、导入本组件

<script setup lang="ts">
    // 必须用分别导入方式（在 main.js or main.ts 中全局注册，则要用默认导入方式）
    import { GotoTopOrBottom } from '@samdy-chan/vue3-goto-top-or-bottom';

    /**** 组件参数及支持的自定义事件设置 ****/
	/** 本组件目前支持配置及传递 2 个可选的自定义事件，分别是：@topFinished、@bottomFinished，说明如下：
@topFinished：点击[回到顶部]图标或滚动条滚动到顶部后，要调用的自定义事件回调函数；
@bottomFinished：点击[回到底部]图标或滚动条滚动到底部后，要调用的自定义事件回调函数；
	**/

    /** 本组件目前支持配置及传递 7 个 Props 参数，分别是：timeout、parentIsWindow、showIconTips、showWhichIcon、scrollDistance、cssObj、animateObj，其中 cssObj、animateObj 为对象式配置参数，这些参数的作用及说明如下（也可详见本组件的TS类型声明文件<<goto-top-or-bottom.vue.d.ts>>，如果是在 vite + ts 环境中使用本组件，import 导入本组件后，按住Ctrl+鼠标左击本组件名，会自动弹出类型声明或跳转到类型声明文件）
    **/
    // 参数一（timeout）：可选参数，加载或刷新页面时，延迟显示本组件滚动图标的时间，默认值为2000毫秒（2秒）。因为父容器的内容有可能是异步获取的（如读取文件或请求后端 api 接口），这样的话，一开始父容器还没有内容，是不会有滚动条的，待获取到异步数据填充到父容器并超过其允许的高度后，才会出现滚动条，此时，才判断需要显示滚动图标，可根据你的系统及网络状况，调节该延迟参数，单位为毫秒，一般使用默认值2000毫秒应该足够。
    const timeout = 2000;
    
    // 参数二（parentIsWindow）：可选参数，父容器是否为顶级元素（window/document/body），默认值为false，将本组件放在哪个HTML标签容器内，就是使用本组件控制哪个HTML标签容器（父容器）的滚动。
    const parentIsWindow = false;
    /** 如果需要为某个块级父容器（如 div/main/section/article/aside/display:block等）添加本滚动图标组件，只需要将本组件放在父容器一级子级别中即可，如下：
    <div class="parent-container">
      ......
      <GotoTopOrBottom />
    </div>
    **/

    /** 如果需要把本滚动图标组件控制顶级对象（window/document/body）的滚动，即滚动整个页面窗口的滚动条时，显示和使用本组件，侧可将本组件放在页面任何HTML标签内，但需要指定 parentIsWindow 参数或设置为 true，如下：
      ......
      <GotoTopOrBottom :parentIsWindow="true" />
    **/
    
    // 参数三（showIconTips）：可选参数，鼠标放在[回到顶部/底部]图标是否显示标签 title 属性的提示内容，默认值 true
    const showIconTips = true;

	// 参数四（showWhichIcon）：可选参数，根据当前滚动情况，显示哪个滚动图标：
    // 'both'：显示[回到顶/底部]两个图标（默认值），
    // 'top'：只显示[回到顶部]图标，
    // 'bottom'：只显示[回到底部]图标
    const showWhichIcon = 'both';

	// 参数五（scrollDistance）：可选参数，滚动多少距离后才显示[回到顶/底部]图标，默认值 1
    const scrollDistance: 1;
    
    // 参数六（cssObj）：可选参数，组件 css 样式设置参数的对象，以下均为默认值，如不传该参数，各属性将使用默认值，
    // 如果只想修改某些 css 属性，只需要设置需要修改的属性即可，如：
    // <GotoTopOrBottom :cssObj="{width: '30px', height: '30px'}" />
	// cssObj 样式设置对象参数各属性默认值如下：
    const cssObj = {
      // 本组件滚动图标距离父容器或页面顶部的距离，默认值是50%，top: '50%' + translateY: '-50%' 为垂直居中
      top: '50%',
      // 本组件滚动图标距离父容器或页面右边距的距离，默认值30px
      right: '30px',
      // 本组件滚动图标向上移动自身距离的一半（-50%，默认）
      translateY: '-50%',
      // [回到底部]图标盒子顶部距离[回到顶部]图标底部的距离，默认值10px
      marginTop: '10px',
      // 本组件滚动图标的宽高大小设置，默认值40px
      width: '40px',
      height: '40px',
      // 本组件滚动图标的四边角圆弧度设置，50%为正圆形，默认值50%
      borderRadius: '50%',
      // 本组件滚动图标的颜色，默认为浅蓝色#2c8ce6
      backgroundColor: '#2c8ce6',
      // 本组件滚动图标的透明度设置，默认值为 0.6
      opacity: '.6',
      // 拖拽滚动图标到上下左右边界时保留的间距值，默认值为0px
      sideMargin: '0px'
    }
    
    // 参数七（animateObj）：可选参数，组件滚动动画效果参数设置，以下均为默认值，如不传该参数，将使用以下默认值：
    const animateObj = {
      // 是否开启滚动动画，不开启则立即一次性滚动到顶部/底部，默认开启true
      enable: true,
      // 动画时长，单位毫秒，默认值300毫秒，需开启动画才生效(animateObj.enable=true)。数字越大，滚动越慢，建议保留默认值即可
      duration: 300,
      // 定时器控制多久滚动一次，单位毫秒，默认值15毫秒，需开启动画才生效(animateObj.enable=true)。数字越大，滚动越卡顿，建议保留默认值即可
      interval: 15
    }
    // 说明：animateObj.duration 和 animateObj.interval 参数可产生滚动次数（滚动多少次才能滚动到顶/底部）；滚动次数 = animateObj.duration / animateObj.interval
</script>
```

```html
// 2、使用本组件

// 2.1、在 div 等块状盒子父容器中使用本组件（控制div等块状父容器的滚动）

<template>
    <div class="parent-container">
    <!-- 使用方式1：最基本使用，无需传递任何参数，使用默认值一般足够了，本组件必须放在父容器标签一级层次内 -->
        <GotoTopOrBottom />
    <!-- 使用方式2：传递如上设置的指定参数 -->
        <!--
        <GotoTopOrBottom 
            :timeout="2000" 
            :parentIsWindow="false" 
            :showIconTips="true"
			showWhichIcon="both"
			:scrollDistance="1"
            :cssObj="cssObj" 
            :animateObj="animateObj" />
        -->
        <!-- 使用方式3：传递设置参数的非默认值 -->
        <!--
        <GotoTopOrBottom 
            :timeout="1500" 
			showWhichIcon="top"
			:scrollDistance="50"
            :cssObj="{width: '30px', height: '30px', backgroundColor: '#00ff00'}" 
            :animateObj="{duration: 500}" />
         -->
    </div>
</template>

// 2.2、在 window/document/body 顶级父容器中使用本组件（控制顶级父容器的滚动）
<template>
    <!-- 必须要指定 parentIsWindow 参数或设置其为布尔类型值 true，其它的参数设置同上2.1所说的。
         要将 window/document/body 作为父容器时，可将本组件放在任意HTML标签内
    -->
    <GotoTopOrBottom :parentIsWindow="true" />
</template>
```



- #### Props & Events Instructions（参数及自定义事件使用说明）


- ##### Props 使用说明

<table>
	<thead>
        <tr>
			<th>参数名</th>
			<th>类型</th>
			<th>是否可选</th>
			<th>说明</th>
			<th>默认值</th>
        </tr>
	</thead>
	<tbody>
		<tr>
			<td>timeout</td>
			<td>number</td>
			<td>是</td>
			<td>加载或刷新页面时，延迟显示本组件滚动图标的时间（单位毫秒ms），因为父容器的内容有可能是异步获取的（如读取文件或请求后端 api 接口），这样的话，一开始父容器还没有内容，是不会有滚动条的，待获取到异步数据填充到父容器并超过其允许的高度后，才会出现滚动条，此时，才判断需要显示滚动图标（手动滚动时也会显示滚动图标），可根据你的系统及网络状况，调节该延迟参数，单位为毫秒，一般使用默认值2000毫秒应该足够。</td>
			<td>2000</td>
		</tr>
		<tr>
			<td>parentIsWindow</td>
			<td>boolean</td>
			<td>是</td>
			<td>父容器是否为顶级（window/document/body）元素，将本组件放在哪个HTML标签容器内，就是使用本组件控制哪个HTML标签容器（父容器）的滚动。当此参数值为true时，表示将整个页面窗口设置为父容器，控制整个页面的滚动，此时将本组件放在任意HTML标签内都可以。</td>
			<td>false</td>
		</tr>
		<tr>
			<td>showIconTips</td>
			<td>boolean</td>
			<td>是</td>
			<td>鼠标放在[回到顶部/底部]图标是否显示标签 title 属性的提示内容</td>
			<td>true</td>
		</tr>
		<tr>
			<td>showWhichIcon</td>
			<td>enum: 'both'|'top'|'bottom'</td>
			<td>是</td>
			<td>
			显示哪个滚动图标，根据当前滚动距离情况：<br/>
			<ul>
				<li>'both'：显示[回到顶/底部]两个图标（默认值）</li>
				<li>'top'：只显示[回到顶部]图标</li>
				<li>'bottom'：只显示[回到底部]图标</li>
			</ul>
			</td>
			<td>'both'</td>
		</tr>
		<tr>
			<td>scrollDistance</td>
			<td>number</td>
			<td>是</td>
			<td>滚动多少距离后才显示[回到顶/底部]图标</td>
			<td>1</td>
		</tr>
		<tr style="background-color:#9fdfbf;">
			<td>cssObj</td>
			<td>object</td>
			<td>是</td>
			<td>
	            组件 css 样式设置参数的对象，如不传该参数，所有属性使用默认值，如果只想修改某些 css 属性，只需要设置需要修改的属性即可，如：
	&lt;GotoTopOrBottom :cssObj="{width: '30px', height: '30px'}" /&gt;
	        </td>
			<td>
			{ <br/>
				top: '50%', <br/>
				right: '30px', <br/>
				translateY: '-50%', <br/>
				marginTop: '10px', <br/>
				width: '40px', <br/>
				height: '40px', <br/>
				borderRadius: '50%', <br/>
				backgroundColor: '#2c8ce6', <br/>
				opacity: '.6', <br/>
				sideMargin: '0px' <br/>
			}
			</td>
		</tr>
	    <tr style="background-color:#9fdfbf;">
			<td>cssObj.top</td>
			<td>string</td>
			<td>是</td>
			<td>滚动图标距离页面顶部的距离，默认值50%，top: '50%' + translateY: '-50%' 为垂直居中</td>
			<td>'50%'</td>
		</tr>
        <tr style="background-color:#9fdfbf;">
			<td>cssObj.right</td>
			<td>string</td>
			<td>是</td>
			<td>滚动图标距离父容器或页面右边距的距离</td>
			<td>'30px'</td>
		</tr>
        <tr style="background-color:#9fdfbf;">
			<td>cssObj.translateY</td>
			<td>string</td>
			<td>是</td>
			<td>滚动图标向上移动自身距离的一半</td>
			<td>'-50%'</td>
		</tr>
        <tr style="background-color:#9fdfbf;">
			<td>cssObj.marginTop</td>
			<td>string</td>
			<td>是</td>
			<td>[回到底部]图标盒子顶部距离[回到顶部]图标底部的距离</td>
			<td>'10px'</td>
		</tr>
        <tr style="background-color:#9fdfbf;">
			<td>cssObj.width</td>
			<td>string</td>
			<td>是</td>
			<td>[回到顶/底部]单个滚动图标的宽度大小设置</td>
			<td>'40px'</td>
		</tr>
        <tr style="background-color:#9fdfbf;">
			<td>cssObj.height</td>
			<td>string</td>
			<td>是</td>
			<td>[回到顶/底部]单个滚动图标的高度大小设置</td>
			<td>'40px'</td>
		</tr>
        <tr style="background-color:#9fdfbf;">
			<td>cssObj.borderRadius</td>
			<td>string</td>
			<td>是</td>
			<td>滚动图标的四边角圆弧度设置，50%为正圆形</td>
			<td>'50%'</td>
		</tr>
        <tr style="background-color:#9fdfbf;">
			<td>cssObj.backgroundColor</td>
			<td>string</td>
			<td>是</td>
			<td>滚动图标的颜色，默认为浅蓝色</td>
			<td>'#2c8ce6'</td>
		</tr>
        <tr style="background-color:#9fdfbf;">
			<td>cssObj.opacity</td>
			<td>string</td>
			<td>是</td>
			<td>滚动图标的透明度设置</td>
			<td>'0.6'</td>
		</tr>
        <tr style="background-color:#9fdfbf;">
			<td>cssObj.sideMargin</td>
			<td>string</td>
			<td>是</td>
			<td>拖拽滚动图标到上下左右边界时保留的间距值</td>
			<td>'0px'</td>
		</tr>
        <tr style="background-color:#e5eeff;">
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
        <tr style="background-color:#ccccff;">
			<td>animateObj</td>
			<td>object</td>
			<td>是</td>
			<td>组件滚动动画效果参数设置，如不传该参数，所有属性使用默认值，如果只想修改某些属性，只需要设置需要修改的属性即可，如：
	&lt;GotoTopOrBottom :animateObj="{duration: 500}" /&gt;</td>
			<td>
            { <br/>
				enable: true, <br/>
				duration: 300, <br/>
				interval: 15, <br/>
			}
            </td>
		</tr>
        <tr style="background-color:#ccccff;">
			<td>animateObj.enable</td>
			<td>boolean</td>
			<td>是</td>
			<td>是否开启缓慢滚动动画，不开启则立即一次性滚动到顶部/底部，默认开启</td>
			<td>true</td>
		</tr>
        <tr style="background-color:#ccccff;">
			<td>animateObj.duration</td>
			<td>number</td>
			<td>是</td>
			<td>动画时长，单位毫秒，默认值300毫秒，需开启动画才生效(animateObj.enable=true)。数字越大，滚动越慢，建议保留默认值即可</td>
			<td>300</td>
		</tr>
        <tr style="background-color:#ccccff;">
			<td>animateObj.interval</td>
			<td>number</td>
			<td>是</td>
			<td>定时器控制多久滚动一次，单位毫秒，默认值15毫秒，需开启动画才生效(animateObj.enable=true)。数字越大，滚动越卡顿，建议保留默认值即可</td>
			<td>15</td>
		</tr>
        <tr style="background-color:#ccccff;">
			<td>备注</td>
			<td colspan="4">
                animateObj.duration 和 animateObj.interval 参数可产生滚动次数（滚动多少次才能滚动到顶/底部）；
                <br/>
                滚动次数 = animateObj.duration / animateObj.interval
            </td>
		</tr>
	</tbody>
</table>


- ##### Events 使用说明

<table>
	<thead>
        <tr>
			<th>事件名</th>
			<th>类型</th>
			<th style="width:100px;">是否可选</th>
			<th>说明</th>
        </tr>
	</thead>
	<tbody>
		<tr>
            <td>@topFinished</td>
            <td>Function</td>
            <td>是</td>
            <td>点击[回到顶部]图标或滚动条滚动到顶部后，要调用的自定义事件回调函数</td>
		</tr>
        <tr>
            <td>@bottomFinished</td>
            <td>Function</td>
            <td>是</td>
            <td>点击[回到底部]图标或滚动条滚动到底部后，要调用的自定义事件回调函数</td>
		</tr>
	</tbody>
</table>


- #### Preview（本组件使用效果预览图）


- 本组件使用过程中的 GIF 动态效果图（图片经过压缩，视觉可能会有所模糊）：

![本组件使用动态效果图](http://qiniu.sirurl.cn/my-npm-pkg-imgs/vue-goto-top-or-bottom_compressed.gif)



- 组件会根据当前浏览器使用的语言环境，如果是中文环境 ，则显示中文提示，否则显示英文提示，如下图：


![本组件操作中文提示效果图](http://qiniu.sirurl.cn/my-npm-pkg-imgs/goto-top-or-bottom_tips_zh.jpg)



![本组件操作英文提示效果图](http://qiniu.sirurl.cn/my-npm-pkg-imgs/goto-top-or-bottom_tips_en.jpg)




- #### **版本历史：**

  1. 从 v1.0.0 到 v1.0.1，v1.0.1 版本变更及改进如下：

      1.1、对组件代码进行了优化；

      1.2、对说明文档《README.md》和《README_zh-CN.md》进行了更改和完善； 