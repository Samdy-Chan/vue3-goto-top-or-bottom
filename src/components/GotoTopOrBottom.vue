<template>
    <div ref="gotoContainerRef" class="goto-container" :style="{
        '--container-top': cssObj.top,
        '--container-right': cssObj.right,
        '--container-translate-y': cssObj.translateY,
        '--bottom-icon-margin-top': cssObj.marginTop,
        '--icon-width': cssObj.width,
        '--icon-height': cssObj.height,
        '--icon-border-radius': cssObj.borderRadius,
        '--icon-background-color': cssObj.backgroundColor,
        '--icon-opacity': cssObj.opacity,
    }">

        <div ref="gotoTopBoxRef" @click="gotoTopHandler" class="goto-top-box"
            :title="props.showIconTips ? tipsInfo.upIconTips : ''">
            <div class="goto-top">
                <img src="@/assets/images/top_icon_alpha.png" />
            </div>
        </div>

        <div ref="gotoBottomBoxRef" @click="gotoBottomHandler" class="goto-bottom-box"
            :title="props.showIconTips ? tipsInfo.downIconTips : ''">
            <div class="goto-bottom">
                <img src="@/assets/images/top_icon_alpha.png" />
            </div>
        </div>
    </div>

    <div ref="popMenuBoxRef" class="pop-menu-box" :style="{ '--menu-item-bgcolor': menuItemBgcolor }">

        <em class="up-triangle"></em>

        <div class="menu-item" :title="tipsInfo.hideMenuItemTips" @click="hideIconHandler">{{ tipsInfo.hideMenuItemText }}
        </div>
        <div class="menu-item" :title="tipsInfo.exitMenuItemTips" @click="exitMenuHandler">{{ tipsInfo.exitMenuItemText }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

defineOptions({
    name: 'GotoTopOrBottom'
});

const props = withDefaults(

    defineProps<{

        parentIsWindow?: boolean;

        timeout?: number;

        showIconTips?: boolean;

        showWhichIcon?: 'both' | 'top' | 'bottom';

        scrollDistance?: number;

        animateObj?: {

            enable?: boolean;

            duration?: number;

            interval?: number;
        };

        cssObj?: {

            top?: string;
            right?: string;
            translateY?: string;

            marginTop?: string;

            width?: string;
            height?: string;
            borderRadius?: string;
            backgroundColor?: string;
            opacity?: string;

            sideMargin?: string;
        }
    }>(),

    {

        parentIsWindow: false,

        timeout: 2000,

        showIconTips: true,

        showWhichIcon: 'both',

        scrollDistance: 1,

        animateObj: () => ({

            enable: true,

            duration: 300,

            interval: 15
        }),

        cssObj: () => ({
            top: '50%',
            right: '30px',
            translateY: '-50%',
            marginTop: '10px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#2c8ce6',
            opacity: '.6',
            sideMargin: '0px',
        }),
    }
);

const animateObj = Object.assign({
    enable: true,
    duration: 300,
    interval: 15
}, props.animateObj);

const cssObj = Object.assign({
    top: '50%',
    right: '30px',
    translateY: '-50%',
    marginTop: '10px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#2c8ce6',
    opacity: '.6',
    sideMargin: '0px',
}, props.cssObj);

const emits = defineEmits(['topFinished', 'bottomFinished']);

const menuItemBgcolor = ref<string>('');

let parentBox: HTMLDivElement | HTMLElement;

const gotoContainerRef = ref<HTMLDivElement>();

const gotoTopBoxRef = ref<HTMLDivElement>();

const gotoBottomBoxRef = ref<HTMLDivElement>();

const popMenuBoxRef = ref<HTMLDivElement>();

let inMountedTimer: any = null;

const controller = new AbortController();

const tipsInfo_zh = {

    upIconTips: '点击上滚,长按移动,右击隐藏',

    downIconTips: '点击下滚,长按移动,右击隐藏',

    hideMenuItemText: '隐藏',

    exitMenuItemText: '退出',

    hideMenuItemTips: '临时隐藏,刷新重现',

    exitMenuItemTips: '取消操作'
};
const tipsInfo_us = {

    upIconTips: 'Click scroll up, long press to move, right-click to hide.',

    downIconTips: 'Click scroll down, long press to move, right-click to hide.',

    hideMenuItemText: 'Hidden',

    exitMenuItemText: 'Exit',

    hideMenuItemTips: 'Temporary hide, refresh to re-show.',

    exitMenuItemTips: 'Cancel operation.'
};
const tipsInfo = computed(() => {

    let language: string = navigator.language || (navigator as any).browserLanguage;
    language = language.toLowerCase();

    if (language === 'zh' || language.match(/^zh[_-]/)) {
        return tipsInfo_zh;
    }

    return tipsInfo_us;
});

onMounted(() => {

    parentBox = !props.parentIsWindow
        ? gotoContainerRef.value!.parentElement as HTMLDivElement

        : document.documentElement;

    if (!props.parentIsWindow) {
        const parentPosition = getComputedStyle(parentBox).position;

        if (!['absolute', 'relative', 'fixed'].includes(parentPosition)) {
            parentBox.style.position = 'relative';
        }
    } else {
        gotoContainerRef.value!.style.position = 'fixed';
    }

    inMountedTimer = setTimeout(() => {

        let parentBoxHeight = props.parentIsWindow ? window.innerHeight : parentBox.clientHeight;

        if (
            parentBox.scrollHeight > parentBoxHeight
            &&
            parentBox.scrollTop <= parentBox.scrollHeight - parentBoxHeight - props.scrollDistance
            &&
            ['both', 'bottom'].includes(props.showWhichIcon)
        ) {
            gotoBottomBoxRef.value!.style.display = 'block';

            gotoBottomBoxRef.value!.style.marginTop = '0';
        }

        if (
            parentBox.scrollTop >= props.scrollDistance
            &&
            ['both', 'top'].includes(props.showWhichIcon)
        ) {
            gotoTopBoxRef.value!.style.display = 'block';

            if (gotoBottomBoxRef.value!.style.display === 'block') {
                gotoBottomBoxRef.value!.style.marginTop = cssObj.marginTop;
            }
        }

        const { top: bottomIconTop, left: bottomIconLeft } = gotoBottomBoxRef.value!.getBoundingClientRect();

        const iconWidth = parseFloat(cssObj.width);
        const iconHeight = parseFloat(cssObj.height);

        const scrollTop = props.parentIsWindow ? parentBox.scrollTop : 0;

        popMenuBoxRef.value!.style.top = (bottomIconTop + iconHeight / 2 + 10 - scrollTop) + 'px';

        popMenuBoxRef.value!.style.left = (bottomIconLeft + iconWidth / 2) - (80 / 2) + 'px';

        if (!props.parentIsWindow) {
            parentBox.addEventListener('scroll', chkShowTopOrBottomIcon, { signal: controller.signal });
        } else {
            window.addEventListener('scroll', chkShowTopOrBottomIcon, { signal: controller.signal });
        }

        window.addEventListener('resize', chkShowTopOrBottomIcon, { signal: controller.signal });

        window.addEventListener('scroll', (e) => {
            if (!props.parentIsWindow && gotoContainerRef.value!.style.position !== 'absolute') {

                const gotoContainerRect = gotoContainerRef.value!.getBoundingClientRect();

                const parentBoxRect = parentBox.getBoundingClientRect();

                let iconTopMargin = gotoContainerRef.value!.offsetHeight <= parseFloat(cssObj.height)

                    ? iconHeight / 2

                    : (iconHeight * 2 + parseFloat(cssObj.marginTop)) / 2;

                let gotoContainerTop = gotoContainerRect.top - parentBoxRect.top + iconTopMargin + parentBox.scrollTop;
                let gotoContainerLeft = gotoContainerRect.left - parentBoxRect.left + parentBox.scrollLeft;

                const styleObj = {
                    position: 'absolute',
                    top: gotoContainerTop + 'px',
                    left: gotoContainerLeft + 'px'
                };

                Object.assign(gotoContainerRef.value!.style, styleObj);
            }

            if (!props.parentIsWindow && popMenuBoxRef.value!.style.position !== 'absolute') {

                const popMenuBoxRect = popMenuBoxRef.value!.getBoundingClientRect();

                const parentBoxRect = parentBox.getBoundingClientRect();

                let popMenuBoxTop = popMenuBoxRect.top - parentBoxRect.top + parentBox.scrollTop;
                let popMenuBoxLeft = popMenuBoxRect.left - parentBoxRect.left + parentBox.scrollLeft;

                const styleObj = {
                    position: 'absolute',
                    top: popMenuBoxTop + 'px',
                    left: popMenuBoxLeft + 'px'
                };

                Object.assign(popMenuBoxRef.value!.style, styleObj);
            }
        }, { signal: controller.signal });

        function setIconPosToFixed() {
            if (!props.parentIsWindow && gotoContainerRef.value!.style.position !== 'fixed') {

                const gotoContainerRect = gotoContainerRef.value!.getBoundingClientRect();

                let iconTopMargin = gotoContainerRef.value!.offsetHeight <= parseFloat(cssObj.height)

                    ? iconHeight / 2

                    : (iconHeight * 2 + parseFloat(cssObj.marginTop)) / 2;

                const styleObj = {
                    position: 'fixed',
                    top: (gotoContainerRect.top + iconTopMargin) + 'px',
                    left: gotoContainerRect.left + 'px'
                };

                Object.assign(gotoContainerRef.value!.style, styleObj);
            }

            if (popMenuBoxRef.value!.style.position !== 'fixed') {
                const popMenuBoxRect = popMenuBoxRef.value!.getBoundingClientRect();

                const styleObj = {
                    position: 'fixed',
                    top: popMenuBoxRect.top + 'px',
                    left: popMenuBoxRect.left + 'px'
                };

                Object.assign(popMenuBoxRef.value!.style, styleObj);
            }
        }

        function chkShowTopOrBottomIcon(e: Event) {

            setIconPosToFixed();

            let parentBoxHeight = props.parentIsWindow ? window.innerHeight : parentBox.clientHeight;

            if (e.type === 'scroll') {
                if (parentBox.scrollTop <= 0) {

                    emits('topFinished');
                } else if (parentBox.scrollTop >= parentBox.scrollHeight - parentBoxHeight) {

                    emits('bottomFinished');
                }
            }

            if (
                parentBox.scrollTop >= props.scrollDistance
                &&
                ['both', 'top'].includes(props.showWhichIcon)
            ) {
                gotoTopBoxRef.value!.style.display = 'block';
            } else {
                gotoTopBoxRef.value!.style.display = 'none';
            }

            if (
                parentBox.scrollTop <= parentBox.scrollHeight - parentBoxHeight - props.scrollDistance
                &&
                ['both', 'bottom'].includes(props.showWhichIcon)
            ) {
                gotoBottomBoxRef.value!.style.display = 'block';
            } else {
                gotoBottomBoxRef.value!.style.display = 'none';
            }

            if (gotoTopBoxRef.value!.style.display == 'block' && gotoBottomBoxRef.value!.style.display == 'block') {
                gotoBottomBoxRef.value!.style.marginTop = cssObj.marginTop;
            } else {
                gotoBottomBoxRef.value!.style.marginTop = '0';
            }

            const mousedown_event = new MouseEvent('mousedown', {
                view: window,
                bubbles: false,
                cancelable: true
            });

            const mousemove_event = new MouseEvent('mousemove', {
                view: window,
                bubbles: false,
                cancelable: true
            });

            const mouseup_event = new MouseEvent('mouseup', {
                view: window,
                bubbles: false,
                cancelable: true
            });

            gotoContainerRef.value!.dispatchEvent(mousedown_event);
            document.dispatchEvent(mousemove_event);
            document.dispatchEvent(mouseup_event);
            gotoContainerRef.value!.dispatchEvent(mouseup_event);
        }

        let dragTimer: any = null;

        let isLongPress = false;

        gotoContainerRef.value!.addEventListener('mousedown', function (e) {

            setIconPosToFixed();

            if (e.buttons !== 2) {

                e.preventDefault();

                if (e.isTrusted) {
                    dragTimer = setTimeout(() => {

                        isLongPress = true;

                        gotoContainerRef.value!.style.cursor = gotoTopBoxRef.value!.style.cursor = gotoBottomBoxRef.value!.style.cursor = 'move';
                    }, 500);
                }

                let x = e.pageX - gotoContainerRef.value!.offsetLeft;
                let y = e.pageY - gotoContainerRef.value!.offsetTop;

                document.addEventListener('mousemove', move, { signal: controller.signal });

                function move(e: MouseEvent) {

                    let left = e.pageX - x;
                    let top = e.pageY - y;

                    const gotoContainerRect1 = gotoContainerRef.value!.getBoundingClientRect();

                    gotoContainerRef.value!.style.left = left + 'px';
                    gotoContainerRef.value!.style.top = top + 'px';

                    const parentBoxRect = parentBox.getBoundingClientRect();
                    const {
                        left: parentLeft,
                        right: parentRight,
                        top: parentTop,
                        bottom: parentBottom
                    } = parentBoxRect;

                    let sideMargin = parseFloat(cssObj.sideMargin);

                    let iconHeight = parseFloat(cssObj.height);

                    let bottomIconMarginTop = parseFloat(cssObj.marginTop);

                    let iconTopMargin = gotoContainerRef.value!.offsetHeight <= iconHeight
                        ? iconHeight / 2
                        : (iconHeight * 2 + bottomIconMarginTop) / 2;

                    iconTopMargin += sideMargin;

                    if (left < parentLeft + sideMargin) {
                        gotoContainerRef.value!.style.left = (parentLeft + sideMargin) + 'px';

                    } else if (left > parentRight - gotoContainerRef.value!.offsetWidth - sideMargin) {
                        gotoContainerRef.value!.style.left = (parentRight - gotoContainerRef.value!.offsetWidth - sideMargin) + 'px';
                    }

                    if (!props.parentIsWindow) {
                        if (top < parentTop + iconTopMargin) {

                            gotoContainerRef.value!.style.top = (parentTop + iconTopMargin) + 'px';
                        } else if (top > parentBox.offsetHeight + parentTop - iconTopMargin) {

                            gotoContainerRef.value!.style.top = (parentBox.offsetHeight + parentTop - iconTopMargin) + 'px';
                        } else if (top > window.innerHeight - iconTopMargin) {

                            gotoContainerRef.value!.style.top = (window.innerHeight - iconTopMargin) + 'px';
                        }
                    } else {

                        if (top < parentBox.scrollTop + parentTop + iconTopMargin) {
                            gotoContainerRef.value!.style.top = (parentBox.scrollTop + parentTop + iconTopMargin) + 'px';
                        } else if (top > window.innerHeight - iconTopMargin) {
                            gotoContainerRef.value!.style.top = (window.innerHeight - iconTopMargin) + 'px';
                        }
                    }

                    const gotoContainerRect2 = gotoContainerRef.value!.getBoundingClientRect();

                    const moveTop = gotoContainerRect2.top - gotoContainerRect1.top;
                    const moveLeft = gotoContainerRect2.left - gotoContainerRect1.left;

                    const popMenuBoxRect = popMenuBoxRef.value!.getBoundingClientRect();
                    popMenuBoxRef.value!.style.top = popMenuBoxRect.top + moveTop + 'px';
                    popMenuBoxRef.value!.style.left = popMenuBoxRect.left + moveLeft + 'px';

                }

                document.addEventListener('mouseup', function () {
                    document.removeEventListener('mousemove', move);
                }, { signal: controller.signal });

            }
        }, { signal: controller.signal });

        parentBox.addEventListener('mouseleave', (e) => {

            const click_event = new MouseEvent('click', {
                view: window,
                bubbles: false,
                cancelable: true
            });
            gotoContainerRef.value!.dispatchEvent(click_event);
        }, { signal: controller.signal });

        gotoContainerRef.value!.addEventListener('click', (e) => {

            if (isLongPress) {
                e.stopPropagation();
            }

            if (e.isTrusted) {

                if (gotoTopTimer) clearInterval(gotoTopTimer);

                if (gotoBottomTimer) clearInterval(gotoBottomTimer);
            }

            if (dragTimer) clearTimeout(dragTimer);

            isLongPress = false;

            gotoContainerRef.value!.style.cursor = 'auto';
            gotoTopBoxRef.value!.style.cursor = gotoBottomBoxRef.value!.style.cursor = 'pointer';

        }, { signal: controller.signal, capture: true });

        gotoContainerRef.value!.addEventListener('contextmenu', (e) => {

            e.preventDefault();

            popMenuBoxRef.value!.style.position = 'fixed';

            popMenuBoxRef.value!.style.display = 'block';

            const x = e.clientX;
            const y = e.clientY;

            popMenuBoxRef.value!.style.left = (x - 80 / 2) + 'px';

            popMenuBoxRef.value!.style.top = (y + 10) + 'px';
        }, { signal: controller.signal });

        document.addEventListener('click', (e) => {
            if (popMenuBoxRef.value!.style.display !== 'none') {
                popMenuBoxRef.value!.style.display = 'none';
            }
        }, { signal: controller.signal });

    }, props.timeout);

    function setHexToRgbColor(sourceColor: string) {
        let targetColor = '';

        let testRule: RegExp = /^rgb(a)?\((0?\d{1,2}|1\d{2}|2[0-4]\d|25[0-5]),\s*(0?\d{1,2}|1\d{2}|2[0-4]\d|25[0-5]),\s*(0?\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])(,\s*(0?.\d|\d))?\)$/gi;
        let matchStr = testRule.exec(sourceColor);
        if (matchStr) {
            console.log('matchStr:', matchStr);
            if (matchStr[1] === 'a') {
                targetColor = sourceColor.replace(matchStr[5], ',.1');
            } else {

                targetColor = sourceColor.replace(/^rgb/i, 'rgba').replace(/\)$/, ',.1)');
            }
        } else if (sourceColor.match(/^#[0-9A-Fa-f]{3,6}$/)) {

            let hexColor = sourceColor.slice(1);
            let r: string | number = '';
            let g: string | number = '';
            let b: string | number = '';

            if (hexColor.length === 3) {
                r = hexColor.charAt(0).repeat(2);
                g = hexColor.charAt(1).repeat(2);
                b = hexColor.charAt(2).repeat(2);

            } else {
                r = hexColor.slice(0, 2);
                g = hexColor.slice(2, 4);
                b = hexColor.length === 4
                    ? hexColor.slice(3).repeat(2)
                    : hexColor.length === 5
                        ? hexColor.slice(4).repeat(2)
                        : hexColor.slice(-2);

            }

            r = parseInt(r, 16);
            g = parseInt(g, 16);
            b = parseInt(b, 16);

            targetColor = `rgba(${r}, ${g}, ${b}, .1)`;
        } else {
            sourceColor = '#2c8ce6';

            let hexColor = sourceColor.slice(1);
            let r: string | number = '';
            let g: string | number = '';
            let b: string | number = '';

            r = hexColor.slice(0, 2);
            g = hexColor.slice(2, 4);
            b = hexColor.slice(4);

            r = parseInt(r, 16);
            g = parseInt(g, 16);
            b = parseInt(b, 16);

            targetColor = `rgba(${r}, ${g}, ${b}, .1)`;
        }

        return targetColor;
    }

    menuItemBgcolor.value = setHexToRgbColor(cssObj.backgroundColor);

});

onUnmounted(() => {

    if (inMountedTimer) clearTimeout(inMountedTimer);
    if (gotoTopTimer) clearInterval(gotoTopTimer);
    if (gotoBottomTimer) clearInterval(gotoBottomTimer);

    controller.abort();
});

let gotoTopTimer: any = null;
const gotoTopHandler = () => {

    if (gotoBottomTimer) clearInterval(gotoBottomTimer);

    if (animateObj.enable === false) {

        parentBox.scroll(0, 0);
    } else {

        const scrollDuration = animateObj.duration;

        const scrollInterval = animateObj.interval;

        const scrollStep = -parentBox.scrollTop / (scrollDuration / scrollInterval);

        gotoTopTimer = setInterval(() => {

            if (parentBox.scrollTop !== 0) {
                parentBox.scrollBy(0, scrollStep);
            } else {
                clearInterval(gotoTopTimer);
            }
        }, scrollInterval);
    }
}

let gotoBottomTimer: any = null;
const gotoBottomHandler = (e: MouseEvent) => {

    if (gotoTopTimer) clearInterval(gotoTopTimer);

    let parentBoxHeight = props.parentIsWindow ? window.innerHeight : parentBox.clientHeight;

    if (animateObj.enable === false) {
        parentBox.scroll(0, parentBox.scrollHeight - parentBoxHeight);

    } else {

        const scrollDuration = animateObj.duration;

        const scrollInterval = animateObj.interval;

        const scrollStep = (parentBox.scrollHeight - parentBoxHeight) / (scrollDuration / scrollInterval);

        gotoBottomTimer = setInterval(() => {

            if (parentBox.scrollTop < parentBox.scrollHeight - parentBoxHeight) {
                parentBox.scrollBy(0, scrollStep);
            } else {
                clearInterval(gotoBottomTimer);
            }
        }, scrollInterval);
    }
}

const hideIconHandler = (e: MouseEvent) => {

    gotoContainerRef.value!.style.display = 'none';

    exitMenuHandler(e);
}

const exitMenuHandler = (e: MouseEvent) => {

    (e.currentTarget! as HTMLDivElement).parentElement!.style.display = 'none';
}

</script>

<style lang="scss" scoped>
.goto-container {
    position: absolute;
    top: var(--container-top);
    right: var(--container-right);
    transform: translateY(var(--container-translate-y));
    z-index: 999999;
    width: var(--icon-width);

    .goto-top-box,
    .goto-bottom-box {
        display: none;
        cursor: pointer;
    }

    .goto-bottom-box {
        transform: rotate(180deg);
        margin-top: var(--bottom-icon-margin-top);
    }

    .goto-top,
    .goto-bottom {
        height: var(--icon-height);
        border-radius: var(--icon-border-radius);
        background-color: var(--icon-background-color);
        opacity: var(--icon-opacity);
        transition: all .4s ease;

        img {
            width: 100%;
            height: 100%;
        }

        &:hover {
            opacity: 1;
            box-shadow: -2px -2px 4px 2px rgba(185, 181, 181, .8);

            transform: scale(1.08);
        }
    }
}

.single-row-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pop-menu-box {
    display: none;
    position: fixed;
    top: 110px;
    left: 20px;
    z-index: 9999999;
    width: 80px;
    border: 1px solid #eee;
    border-radius: 2px;
    background-color: #fff;
    font-size: 12px;
    letter-spacing: 1px;
    box-shadow: -2px -2px 4px 2px rgba(185, 181, 181, .5);

    .up-triangle {

        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -18px;

        margin-top: 1px;

        width: 0;
        height: 0;

        border-style: solid;

        border-width: 9px;
        border-color: transparent transparent #eee transparent;

        &::before {
            content: '';

            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin-top: 1px;

            width: 0;
            height: 0;
            border-style: solid;
            border-width: 8px;
            border-color: transparent transparent #fff transparent;
        }
    }

    .menu-item {

        @extend .single-row-ellipsis;

        padding: 4px 6px;
        text-align: center;
        cursor: pointer;

        &:not(:last-child) {
            border-bottom: 1px solid #eee;
        }

        &:hover {
            background-color: var(--menu-item-bgcolor);
        }
    }
}
</style>