import React, { Component } from 'react';
import TimeProgress from '../TimeProgress/main';
import Apng from 'react-apng';
import { privateShuffle, delayToDo, clearDelay } from '../../utils/tools';
import './style.less';

import dog from '../../static/images/common/dog_animation.png';
import dogEnd from '../../static/images/common/dogEnd.png';
import light from '../../static/images/common/light.png';
import clientApi from '../../api/client';

export default class GameDogBridgePlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: props.word.study ? 'step2' : 'step3',
            showReward: true,
            word: props.word,
            study: props.word.study,
            refuseClick: false,
            gameOver: false
        };
        this.rightArr = [];
        this.randomArr = [];
        this.num_index = 0;
        if (!props.word.study) {
            for (let index = 0; index < props.word.letters.length; index++) {
                if (props.word.letters[index]) {
                    this.rightArr.push(props.word.letters[index]);
                    this.randomArr.push(this.num_index);
                    this.num_index++;
                }
            }
            this.index = this.rightArr.length === 3 ? 1 : 0;
            privateShuffle(this.randomArr);
            let _index = 0;
            this.letterItem = props.word.letters.map((ele, index) => {
                let styleObj;
                let className;
                let randomLeft;
                if (ele !== '') {
                    if (this.randomArr.length === 3) randomLeft = 223;
                    if (this.randomArr.length === 4) randomLeft = 111;
                    if (this.randomArr.length === 5) randomLeft = 0;
                    styleObj = {
                        transform: `translate(${(randomLeft +
                            223 * this.randomArr[_index] -
                            (41 + 202 * index)) /
                            16}vw,${253 / 16}vw)`
                    };
                    className = 'letter-item';
                    _index++;
                } else {
                    className = 'letter-item active';
                }
                return (
                    <div
                        key={index}
                        className={className}
                        style={styleObj}
                        data-preindex={index}
                        onClick={e => {
                            this.letterItemClick(e);
                        }}
                    >
                        <div className="letter-box">{ele}</div>
                    </div>
                );
            });
        }
        this.letterItemClick = this.letterItemClick.bind(this);
        this.timeOutFun = this.timeOutFun.bind(this);
    }
    componentDidMount() {
        delayToDo(() => {
            this.setState({ completeRander: 'active' });
        }, 0.1);
        delayToDo(() => {
            this.setState({ completeRander: 'active hide' });
        }, 1.1);
    }
    componentWillUnmount() {
        clearDelay();
    }
    letterItemClick(e) {
        const target = e.target;
        const targetParent = target.parentNode;
        const value = target.textContent;
        const preIndex = targetParent.getAttribute('data-preindex');
        let index = this.rightArr.length === 3 ? this.index - 1 : this.index;
        console.log(this.state.gameOver);
        if (this.state.gameOver) return false;
        if (
            this.state.refuseClick ||
            Boolean(target.className.match('active')) ||
            Boolean(target.className.match('letter-item'))
        ) {
            return false;
        } else {
            if (value === this.rightArr[index]) {
                targetParent.style.transform = `translate(${((this.index -
                    preIndex) *
                    202) /
                    16}vw,0)`;
                target.className = 'letter-box active';
                this.index++;
                index++;
                if (index === this.rightArr.length) {
                    delayToDo(() => {
                        this.setState({ showLight: true, gameWin: true });
                        clientApi.playSound({ soundId: 13 });
                        delayToDo(() => {
                            this.light.pause();
                            this.setState({ step: 'step2', showLight: false });
                            this.dog.play();
                            this.dogWalk();
                        }, 0.5);
                    }, 0.3);
                } else { clientApi.playSound({ soundId: 14 }) }
            } else {
                clientApi.playSound({ soundId: 15 });
                this.setState({ refuseClick: true });
                target.className =
                    'letter-box active animated infinite shake delay-2s';
                delayToDo(() => {
                    target.className = 'letter-box';
                    this.setState({ refuseClick: false });
                }, 1);
            }
        }
    }
    timeOutFun() {
        const index = this.rightArr.length === 3 ? this.index - 1 : this.index;
        this.setState({ gameOver: true });
        if (index !== this.rightArr.length) {
            this.setState({ refuseClick: true });
            delayToDo(clientApi.award, 2, { title: 'Nice try' });
        } else {
            delayToDo(clientApi.award, 2, { title: 'Good job', awardCount: 1 });
        }
        // this.timeprogress.style.display = 'none';
        delayToDo(() => {
            this.timeprogress.hideProgress();
        }, 2.1);
    }
    dogWalk() {
        this.setState({ dogStatus: 'move' });
        delayToDo(() => {
            this.dog.pause();
            this.setState({ dogEnd: true, showReward: false });
        }, 2.1);
    }
    render() {
        return (
            <div className={`game-dogBridge ${this.state.step}`}>
                {!this.state.dogEnd && (
                    <div className={`dog-start ${this.state.dogStatus}`}>
                        <Apng
                            className="dog"
                            src={dog}
                            rate={3.5}
                            autoPlay={false}
                            ref={com => (this.dog = com)}
                        />
                    </div>
                )}
                {this.state.dogEnd && (
                    <div className="dog-end">
                        <Apng
                            className="dogEnd"
                            src={dogEnd}
                            rate={2.5}
                            autoPlay={true}
                        />
                    </div>
                )}
                <TimeProgress
                    setTime={10}
                    delayTime={1.1}
                    showResult={this.timeOutFun}
                    // startGame={this.startGame}
                    study={this.state.step !== 'step3'}
                    ref={com => (this.timeprogress = com)}
                />
                <img
                    src={this.state.word.img}
                    alt="wordimg"
                    className="desc-img"
                />
                {this.state.showReward && <div className="reward" />}
                {this.state.step === 'step2' && (
                    <div className="word-wrap">{this.state.word.letters.join('')}</div>
                )}
                {this.state.step === 'step3' && (
                    <div className={`game-pre ${this.state.completeRander}`}>
                        <div
                            className={`left-half ${this.state.completeRander}`}
                        />
                        <div
                            className={`right-half ${
                                this.state.completeRander
                            }`}
                        />
                    </div>
                )}
                {this.state.step === 'step3' && (
                    <div className="letters-wrap">{this.letterItem}</div>
                )}
                {this.state.showLight && (
                    <Apng
                        className="light"
                        src={light}
                        rate={3}
                        autoPlay={true}
                        ref={com => (this.light = com)}
                    />
                )}
            </div>
        );
    }
}
