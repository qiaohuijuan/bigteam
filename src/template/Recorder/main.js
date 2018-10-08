import React, { Component } from 'react';
import d2_1 from '../../static/images/common/d2_1.png';
import clientApi from '../../api/client';
import { delayToDo, clearDelay } from '../../utils/tools';
import {
    followReadAwardRules,
    followReadUpAwardRules
} from '../../data/awardRules';
import './style.less';

/**
 * 录音组件
 * @class Recorder
 * @param {string} text 显示文本
 * @param {string} type 录音类型  1-跟读 2-自由回答 。
 * @param {string} [textType] 录音文本类型 word-单词 sentence-句子
 * @param {string} [audioText] 录音文本，如不传则为显示文本
 * @param {number} setTime 录音时长
 * @param {number} delayTime 延迟录音时间
 * @param {number} top 上坐标
 * @param {number} left 左坐标
 * @param {number} [interval] 游戏模式检测返回间隔
 * @param {number} [count] 游戏模式检测返回结果次数
 * @param {number} [autoRecord=true] 是否自动录音，如不自动录音，可以通过ref调用invokeClientRecord来触发录音。
 * @param {boolean} [noRecordIcon=false] 不显示录音图标
 * @param {boolean} [study=false] 学习模式
 * @extends {Component}
 */
export default class Recorder extends Component {
    componentDidMount() {
        if (window.refuseUp) return; // 异常进入（非翻页）进入录音和游戏页面，不触发客户端录音
        const { autoRecord = true, type, study = false } = this.props;
        if (!autoRecord || study) return;
        // 解决异常进入获取录音dom节点延迟
        if (type > 100) {
            setTimeout(this.invokeClientMonitor, 500);
            // this.invokeClientMonitor();
        } else {
            setTimeout(this.invokeClientRecord, 500);
            // this.invokeClientRecord();
        }
    }
    componentWillUnmount() {
        clearDelay();
    }
    invokeClientRecord = ({
        setTime: set_time,
        delayTime: delay_time
    } = {}) => {
        let { type, setTime, delayTime } = this.props;
        let timeout = 0.2;
        let prepare = 0;
        setTime = typeof set_time === 'number' ? set_time : setTime;
        delayTime = typeof delay_time === 'number' ? delay_time : delayTime;
        if (delayTime >= 3) {
            prepare = 3;
            timeout = Math.ceil(delayTime - prepare);
        } else {
            prepare = delayTime;
        }
        const position = this.getRecordPosition();
        this.paramData = {
            time: setTime,
            prepare,
            ...position
        };
        switch (type) {
            case 1:
                this.resultType1(timeout);
                break;
            case 2:
                this.resultType2(timeout);
                break;
            default:
                this.defaultType();
                break;
        }
    };
    invokeClientMonitor = () => {
        let { type, interval = 1, count = 10, delayTime } = this.props;
        let timeout = 0.2;
        let prepare = 0;
        if (delayTime >= 3) {
            prepare = 3;
            timeout = Math.ceil(delayTime - prepare);
        } else {
            prepare = delayTime;
        }
        const position = this.getRecordPosition({ distance: true });
        this.paramData = {
            prepare,
            interval,
            count,
            ...position
        };
        switch (type) {
            case 101:
                this.resultType101(timeout);
                break;
            default:
                this.defaultType();
                break;
        }
    };
    getRecordPosition = (opt = {}) => {
        if (!this.recorder) return;
        const { distance } = opt;
        const { noRecordIcon = false } = this.props;
        let style = null;
        if (window.getComputedStyle) {
            style = window.getComputedStyle(this.recorder, null); // 非IE
        } else {
            style = this.recorder.currentStyle; // IE
        }
        const top = parseInt(this.recorder.offsetTop, 10);
        const left = parseInt(this.recorder.offsetLeft, 10);
        const width = parseInt(style.width, 10);
        const height = parseInt(style.height, 10);
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const re = noRecordIcon
            ? { centerX: -1000, centerY: -1000 }
            : { centerX, centerY };
        if (distance) {
            re.gap = window.innerWidth * 0.85 - centerX;
        }
        return re;
    };
    defaultType = timeout => {
        console.log('录音模式type传入参数错误');
    };
    resultType1 = timeout => {
        let { text, textType, audioText } = this.props;
        text = audioText ? audioText : text;
        const wordCount = text.split(' ').length;
        if (wordCount <= 2 || textType === 'word') {
            this.paramData.word = text;
        } else {
            this.paramData.sentence = text;
        }
        this.paramData.principles = followReadAwardRules;
        delayToDo(clientApi.evaluate, timeout, this.paramData);
    };
    resultType2 = timeout => {
        this.paramData.sentence = 'I like studying English';
        this.paramData.principles = followReadUpAwardRules;
        delayToDo(clientApi.evaluate, timeout, this.paramData);
    };
    resultType101 = timeout => {
        delayToDo(clientApi.monitorVolume, timeout, this.paramData);
    };
    render() {
        const { left, top, noRecordIcon = false } = this.props;
        return (
            <div
                ref={com => (this.recorder = com)}
                style={{
                    left: `${left / 19.2}vw`,
                    top: `${top / 19.2}vw`
                }}
                className="recorder-box"
            >
                {noRecordIcon ? null : (
                    <img className="mic" src={d2_1} alt="麦克风" />
                )}
            </div>
        );
    }
}
