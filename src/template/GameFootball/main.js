import React, { Component } from 'react';
import Apng from 'react-apng';
import TimeProgress from '../TimeProgress/main';
import QuestionTier from '../QuestionTier/main';
import { delayToDo, clearDelay } from '../../utils/tools';
import { apiDefine, apiCancel } from '../../api/web';
import clientApi from '../../api/client';
import './style.less';

import goalkeeper from '../../static/images/common/goalkeeper.png';
import leftCow from '../../static/images/common/left_cow.png';
import rightCow from '../../static/images/common/right_cow.png';
import leftMe from '../../static/images/common/left_my_cow.png';
import rightMe from '../../static/images/common/right_my_cow.png';
import football from '../../static/images/common/football.png';
import go from '../../static/images/common/go.png';

export default class Football extends Component {
    constructor(props) {
        super(props);
        const { wordList = [] } = props;
        const questionList = new Array(wordList.length + 1)
            .fill(1)
            .map((item, index) => (index < 10 ? `0${index}` : index));
        const questionTotal = questionList.length;
        this.pageStepTotal = wordList.length * 2 - 1; // 页面总步骤数
        this.delayTime = 5; // 延迟开始时间
        this.setTime = 5; // 答题时间
        this.cowList = [];
        this.shootId = null;
        this.lastShootCow = null;
        this.errorStep = 0;
        this.state = {
            goal: false,
            gamerList: [],
            questionList,
            questionTotal,
            showQ: false,
            showGo: false
        };
    }
    componentDidMount() {
        const { step } = this.props;
        apiDefine({ apiName: 'broadcast', fn: this.broadcast });
        this.showQuestion(step);
        this.getGamerInfo();
    }
    componentWillReceiveProps(nextProps) {
        if (window.refuseUp) return;
        const { step = 0 } = nextProps;
        this.showQuestion(step);
    }
    componentWillUnmount() {
        clearDelay();
        apiCancel('broadcast');
    }
    // 获取参与游戏的学生信息，并添加到游戏中（不论是否在线）。
    getGamerInfo = () => {
        let { students = [], myPosition } =
            clientApi.getAllPersonsInfomation() || {};
        const myInfo = students[myPosition] || {};
        if (this.shootState && this.shootState.length > 0) {
            students = students.map(student => {
                const state = this.shootState.filter(
                    item => item.userId === student.userId
                );
                return state.length > 0 ? state[0] : student;
            });
        }
        const gamerList = students.map((item = {}) => {
            return {
                userId: item.userId,
                enName: item.enName,
                score: item.score > 0 ? item.score : 0,
                isMe: item.userId === myInfo.userId,
                isRight: null
            };
        });
        this.shootState = null;
        // mock
        // const gamerList = [
        //     {
        //         userId: 111,
        //         enName: 'wangssss',
        //         score: 1,
        //         isRight: null,
        //         isMe: true
        //     },
        //     { userId: 222, enName: 'li', score: 2, isRight: null }
        // ];
        this.myId = myInfo.userId;
        this.myName = myInfo.enName;
        console.log(gamerList);
        this.setState({
            gamerList
        });
    };
    // 广播消息
    broadcast = arg => {
        const { msgTag } = JSON.parse(arg);
        const params = JSON.parse(arg);
        if (Number(msgTag) === 4001) {
            const { callBackFnName } = params;
            this[callBackFnName] && this[callBackFnName]({ ...params });
        }
        if (Number(msgTag) === 3001) {
            const { shootState = [], errorStep = 0 } = params;
            this.errorJoin(shootState, errorStep);
        }
    };
    showQuestion = (index = 0) => {
        const { wordList = [] } = this.props;
        const { gamerList } = this.state;
        const realIndex = parseInt(index / 2, 10);
        const { answer, select = [], text, delayTime = 2 } =
            wordList[Math.ceil(realIndex)] || {};
        const selectStyleList = select.map(() => '');
        const question = {
            question: text,
            showTime: delayTime,
            showAnim: true
        };
        const list = gamerList.map(item => {
            return { ...item, shoot: false };
        });
        if (index % 2 === 1) {
            this.canSelect = false;
            this.qMask.hide();
            this.showGoMask();
        } else {
            this.qMask.reset({ ...question });
            this.toggleQuestion(false);
            this.timeProgress.hideProgress();
        }
        selectStyleList[answer] = 'bingo';
        this.answer = answer;
        this.setState({
            question,
            select,
            selectStyleList,
            gamerList: list,
            selectedStyleList: select.map(() => ''), // 已选择样式控制
            gameOver: false, // 游戏时间结束
            goal: false // 守门员复位
        });
        this.goalkeeper.stop();
        this.lastShootCow && this.lastShootCow.stop();
    };
    showGoMask = () => {
        clientApi.playSound({
            soundId: 16
        });
        this.setState({
            showGo: true
        });
        delayToDo(() => {
            this.timeProgress.startCount();
            this.toggleQuestion(true);
        }, 1);
    };
    toggleQuestion = isShow => {
        this.setState({
            showQ: isShow,
            showGo: false
        });
    };
    stepResult = () => {
        const { step } = this.props;
        if (step > this.errorStep) {
            this.shoot();
        } else {
            this.errorStep = 0;
        }
        this.setState({
            gameOver: true
        });
        if (Number(step) === Number(this.pageStepTotal)) {
            delayToDo(this.showGameResult, 2);
        }
    };
    showGameResult = () => {
        const { gamerList } = this.state;
        const scoreList = gamerList.map(item => item.score);
        const highest = Math.max.apply(null, scoreList);
        if (highest < 1) {
            clientApi.award({ title: 'Nice try' });
        } else {
            const list = gamerList.map(item => {
                if (item.score === highest) {
                    this.myId === item.userId &&
                        clientApi.award({ title: 'Good job', awardCount: 3 });
                    return { ...item, win: true };
                } else {
                    this.myId === item.userId &&
                        clientApi.award({ title: 'Nice try' });
                    return item;
                }
            });
            this.setState({
                gamerList: list
            });
        }
    };
    startGame = () => {
        this.canSelect = true;
    };
    errorJoin = (shootState, errorStep) => {
        console.log(shootState, errorStep);
        if (window.refuseUp) {
            this.errorStep = errorStep;
            this.shootState = shootState.map(item => {
                return { ...item, isRight: '', shoot: false };
            });
            this.getGamerInfo();
            this.sendJoinGameInfo();
        }
    };
    // 异常新加入教室的学生，发送消息通知其他学生
    sendJoinGameInfo = () => {
        if (window.refuseUp) {
            clientApi.broadcast({
                callBackFnName: 'joinGame',
                userId: this.myId,
                enName: this.myName
            });
        }
    };
    // 接到通知后，将异常新加入教室的学生添加到游戏当中
    joinGame = ({ userId, enName }) => {
        const { gamerList = [] } = this.state;
        if (gamerList.filter(item => item.userId === userId).length < 1) {
            gamerList.push({ userId, enName, score: 0, isRight: '' });
        }
        this.setState({
            gamerList
        });
    };
    whoCanShoot = ({ userId, isRight }) => {
        let { gamerList, gameOver } = this.state;
        if (gameOver) return;
        gamerList = gamerList.map(item => {
            if (item.userId === userId) {
                if (!this.shootId) {
                    isRight && (this.shootId = userId);
                    return { ...item, isRight: isRight ? 'best' : 'wrong' };
                } else {
                    return { ...item, isRight: isRight ? 'right' : 'wrong' };
                }
            }
            return item;
        });
        this.setState({
            gamerList
        });
    };
    shoot = () => {
        let total = 0;
        const gamerList = this.state.gamerList.map((item, index) => {
            if (item.userId === this.shootId) {
                this.lastShootCow = this.cowList[index];
                this.lastShootCow.one();
                clientApi.playSound({
                    soundId: 12
                });
                total += item.score + 1;
                return {
                    ...item,
                    score: item.score + 1,
                    shoot: true,
                    isRight: ''
                };
            } else {
                total += item.score;
                return { ...item, isRight: '' };
            }
        });
        this.setState({
            gamerList,
            goal: this.shootId ? true : false
        });
        this.shootId && this.goalkeeper.one();
        this.shootId = null;
        if (total > 0) {
            clientApi.serverSave({
                shootState: gamerList,
                errorStep: this.props.step
            });
        }
    };
    choice = section => {
        if (window.refuseUp) return;
        const { gameOver } = this.state;
        if (this.canSelect && !gameOver) {
            const { selectedStyleList } = this.state;
            selectedStyleList[section] = 'selected show-result';
            selectedStyleList[this.answer] = 'selected show-result';
            clientApi.broadcast({
                callBackFnName: 'whoCanShoot',
                userId: this.myId,
                isRight: section === this.answer
            });
            if (section === this.answer) {
                clientApi.playSound({ soundId: 7 });
            } else {
                clientApi.playSound({ soundId: 8 });
            }
            this.canSelect = false;
            this.setState({
                selectedStyleList
            });
        }
    };
    checkMe = (index, isMe) => {
        if (isMe) {
            return index < 2 ? leftMe : rightMe;
        } else {
            return index < 2 ? leftCow : rightCow;
        }
    };
    render() {
        const {
            select = [],
            gamerList = [],
            selectStyleList = [],
            selectedStyleList = [],
            gameOver,
            question = {},
            questionList = [],
            questionTotal,
            goal,
            showQ,
            showGo
        } = this.state;
        return (
            <div className="game-football">
                <TimeProgress
                    setTime={this.setTime}
                    delayTime={this.delayTime}
                    showResult={this.stepResult}
                    startGame={this.startGame}
                    study={true}
                    mt={20}
                    showCountNum={true}
                    ref={com => (this.timeProgress = com)}
                />
                <QuestionTier ref={com => (this.qMask = com)} {...question} />
                <div className={`go-mask ${showGo ? '' : 'hide-go'}`}>
                    <img className="animated zoomIn" src={go} alt="go" />
                </div>
                <div className="select-box">
                    {select.map((item, index) => {
                        return (
                            <div
                                key={`q${index}`}
                                className={`select-item ${
                                    showQ ? '' : 'hide-question'
                                } ${selectStyleList[index]} ${
                                    gameOver ? 'show-result' : ''
                                } ${selectedStyleList[index]}`}
                                style={{
                                    backgroundImage: `url(${item})`
                                }}
                                onClick={() => {
                                    this.choice(index);
                                }}
                            >
                                <div className="select-mask" />
                            </div>
                        );
                    })}
                </div>
                <Apng
                    className="goalkeeper"
                    ref={com => (this.goalkeeper = com)}
                    src={goalkeeper}
                />
                <div className={`football-box ${goal ? 'goal' : ''}`}>
                    <img
                        className={`football ${goal ? 'animated bounce' : ''}`}
                        src={football}
                        alt="足球"
                    />
                </div>
                {gamerList.map((item, index) => (
                    <Apng
                        key={`cow${index}`}
                        className={`cow ${item.shoot ? 'goal' : ''} ${
                            index < 2 ? 'left' : 'right'
                        } cow${index}`}
                        ref={com => (this.cowList[index] = com)}
                        src={this.checkMe(index, item.isMe)}
                    />
                ))}
                <div className="gamer-info-list">
                    {gamerList.map((item, index) => (
                        <div
                            className={`gamer-info-box box${index}`}
                            key={item.userId}
                        >
                            <div
                                className={`name-box ${item.win ? 'win' : ''}`}
                            >
                                <div>{item.enName}</div>
                            </div>
                            {item.isRight ? (
                                <div
                                    className={`result-mask ${item.isRight}`}
                                />
                            ) : null}
                            <div className="score-box">
                                <div
                                    className="score-list"
                                    style={{
                                        opacity: item.isRight ? 0 : 1,
                                        transform: `translateY(-${(100 /
                                            questionTotal) *
                                            item.score}%)`
                                    }}
                                >
                                    {questionList.map(item => (
                                        <div key={`score${item}`}>{item}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
