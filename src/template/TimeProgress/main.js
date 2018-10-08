import React, { Component } from 'react';
import { apiDefine, apiCancel } from '../../api/web';
import clientApi from '../../api/client';
import './style.less';

/**
 * 进度条组件
 * @param {number} [mt] 上边距
 * @param {number} [styleType=0] 进度条样式
 * @param {number} [setTime=5] 进度条时间
 * @param {number} [delayTime=5] 延迟触发时间
 * @param {function} [startGame] 进度条开始的回调
 * @param {function} [showResult] 进度条结束后的回调
 * @param {number} [countDown] 进度条开始前倒计时
 * @param {number} [showCountNum=false] 显示倒计时数字
 * @param {number} [study] 学习模式不触发进度条，可以通过startCount手动触发
 * @class TimeProgress
 * @extends {Component}
 */

const canvasStyle = [
    {
        width: 1110,
        height: 50,
        progressBg: '#ffffff',
        changeColor: ['#38d962', '#fdc61e', '#e33834']
    },
    {
        width: 672,
        height: 76,
        progressBg: '#3b7056',
        changeColor: ['#ffd800']
    },
    {
        width: 1110,
        height: 50,
        progressBg: '#ffffff',
        changeColor: ['#118D25']
    }
];
export default class TimeProgress extends Component {
    constructor(props) {
        super(props);
        const { setTime = 5, styleType = 0 } = props;
        this.setTime = setTime * 1000;
        this.setSecond = setTime;
        this.recording = false;
        this.thisStyle = canvasStyle[styleType];
        this.state = {
            show: false,
            showTime: 5
        };
    }
    componentDidMount() {
        const { study, delayTime } = this.props;
        if (study) return;
        this.timer = setTimeout(this.startCount, delayTime * 1000);
    }
    componentWillUnmount() {
        cancelAnimationFrame(this.frame);
        clearTimeout(this.timer);
        apiCancel('countOver');
    }
    hideProgress = () => {
        clearTimeout(this.timer);
        cancelAnimationFrame(this.frame);
        this.recording = false;
        this.setState({
            show: false
        });
    };
    startCount = () => {
        const { countDown = false } = this.props;
        if (countDown) {
            apiDefine({ apiName: 'countOver', fn: this.countOver });
            clientApi.countDown({ start: countDown, needCountOver: 1 });
        } else {
            this.countOver();
        }
    };
    countOver = () => {
        this.drawCanvas();
        this.startDraw();
    };
    drawCanvas = () => {
        this.ctx = this.canvas.getContext('2d');
        this.startX = this.canvas.width - this.thisStyle.height / 2;
        this.endX = this.thisStyle.height / 2;
        this.Y = this.canvas.height / 2;
        this.lineW = this.canvas.width - this.thisStyle.height;
        this.progress = 0;
        this.ctx.lineCap = 'round';
        // 录音初始状态绘制
        this.drawTimeProgressBg();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.thisStyle.changeColor[0];
        this.ctx.lineWidth = this.thisStyle.height;
        this.ctx.moveTo(this.startX, this.Y);
        this.ctx.lineTo(this.endX, this.Y);
        this.ctx.stroke();
    };
    arcMove = () => {
        const now = new Date().getTime();
        const duration = now - this.start;
        const countNumber = this.setSecond - parseInt(duration / 1000, 10);
        let { showTime } = this.state;
        this.progress = duration / this.setTime;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTimeProgressBg();
        // 根据duration绘制进度条
        this.ctx.beginPath();
        if (this.thisStyle.changeColor.length > 1) {
            this.ctx.strokeStyle = this.getChangeColor();
        } else {
            this.ctx.strokeStyle = this.thisStyle.changeColor[0];
        }
        this.ctx.lineWidth = this.thisStyle.height;
        this.ctx.moveTo(this.startX + 50, this.Y);
        this.ctx.lineTo(this.endX + 50 + this.progress * this.lineW, this.Y);
        this.ctx.stroke();
        if (showTime !== countNumber) {
            this.setState({
                showTime: Math.max(countNumber, 0),
                countNumColor: this.getChangeColor()
            });
        }
        if (duration > this.setTime) {
            this.recording = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawTimeProgressBg();
            this.bundleShowResult();
            return;
        }
        this.frame = window.requestAnimationFrame(this.arcMove);
    };
    getChangeColor = () => {
        if (this.progress < 0.4) {
            return this.thisStyle.changeColor[0];
        } else if (this.progress < 0.7) {
            return this.thisStyle.changeColor[1];
        } else {
            return this.thisStyle.changeColor[2];
        }
    };
    drawTimeProgressBg = () => {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.thisStyle.progressBg;
        this.ctx.lineWidth = this.thisStyle.height;
        this.ctx.moveTo(this.startX, this.Y);
        this.ctx.lineTo(this.endX, this.Y);
        this.ctx.stroke();
    };
    startDraw = () => {
        if (this.recording) return;
        const { startGame } = this.props;
        this.start = new Date().getTime();
        this.arcMove();
        this.recording = true;
        this.setState({
            show: true
        });
        startGame && startGame();
    };
    bundleShowResult = () => {
        const { showResult } = this.props;
        showResult && showResult();
    };
    render() {
        const { show, showTime, countNumColor } = this.state;
        const { mt, styleType = 0, showCountNum = false } = this.props;
        const style = mt ? { marginTop: `${mt / 19.2}vw` } : {};
        return (
            <div
                className={`time-progress style${styleType} ${
                    show ? 'show' : ''
                }`}
                style={style}
            >
                <canvas
                    width={this.thisStyle.width}
                    height={this.thisStyle.height}
                    ref={dom => (this.canvas = dom)}
                    className="progress"
                />
                {showCountNum ? (
                    <span
                        style={{ color: countNumColor }}
                        className={`count-down style${styleType}`}
                    >
                        {showTime}
                    </span>
                ) : null}
            </div>
        );
    }
}
