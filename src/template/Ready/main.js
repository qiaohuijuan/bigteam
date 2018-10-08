import React, { Component } from 'react';
import { formatTime, delayToDo, clearDelay } from '../../utils/tools';
import './style.less';

/**
 * 倒计时准备组件
 * @class Ready
 * @param {number} [readyTime=10] 倒计时时长
 * @extends {Component}
 */

export default class Ready extends Component {
    state = {
        time: ''
    };
    componentDidMount() {
        this.checkTimes = 0;
        delayToDo(this.timeInit, 0.5);
    }
    componentWillUnmount() {
        clearDelay();
    }
    timeInit = () => {
        const info = window.passInformation || {};
        const { waitingTime } = info;
        this.checkTimes += 1;
        if (typeof waitingTime !== 'number') {
            if (this.checkTimes < 4) {
                setTimeout(this.timeInit, this.checkTimes * 1000);
            }
            return;
        }
        this.timeTotal = waitingTime < 0 ? waitingTime * -1 : 0;
        this.startTime = Date.parse(new Date()) / 1000;
        this.timeCount();
    };
    timeCount = () => {
        const nowTime = Date.parse(new Date()) / 1000;
        const duration = this.timeTotal - (nowTime - this.startTime);
        const time = formatTime(Math.max(duration, 0));
        this.setState({
            time
        });
        if (duration > 0) {
            delayToDo(this.timeCount, 1);
        }
    };
    render() {
        return (
            <div className="ready-tpl">
                <span>{this.state.time}</span>
            </div>
        );
    }
}
