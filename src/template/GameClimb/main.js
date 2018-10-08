import React, { Component } from 'react';
import Apng from 'react-apng';
import TimeProgress from '../TimeProgress/main';
import QuestionTier from '../QuestionTier/main';
import { delayToDo, clearDelay } from '../../utils/tools';
import { apiDefine, apiCancel } from '../../api/web';
import clientApi from '../../api/client';

import './style.less';

import monkey from '../../static/images/common/climb_monkey.png';

export default class GameClimb extends Component {
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
        this.comList = [];
        this.nextUpList = []; // 下一次要向上爬的学生列表
        this.errorStep = 0;
        this.state = {
            questionList,
            questionTotal
        };
    }
    componentDidMount() {
        const { step } = this.props;
        apiDefine({ apiName: 'broadcast', fn: this.broadcast });
        this.showQuestion(step);
        this.getGamerInfo();
    }
    componentWillReceiveProps(nextProps) {
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
        if (this.climbState && this.climbState.length > 0) {
            students = students.map(student => {
                const state = this.climbState.filter(
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
                isRight: null
            };
        });
        this.climbState = null;
        // mock
        // const gamerList = [
        //     { userId: 111, enName: 'wadddddddddng', score: 1, isRight: null },
        //     { userId: 222, enName: 'li', score: 2, isRight: null }
        // ];
        this.myId = myInfo.userId;
        this.myName = myInfo.enName;
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
            const { climbState = [], errorStep = 0 } = params;
            this.errorJoin(climbState, errorStep);
        }
    };
    // 控制展示题目
    showQuestion = (index = 0) => {
        const { wordList = [] } = this.props;
        const realIndex = parseInt(index / 2, 10);
        const { answer, select = [], text, delayTime = 2 } =
            wordList[Math.ceil(realIndex)] || {};
        const selectStyleList = select.map(() => '');
        const question = {
            question: text,
            showTime: delayTime,
            showAnim: true
        };
        if (index % 2 === 1) {
            this.canSelect = false;
            this.qMask.hide();
            this.timeProgress.startCount();
        } else {
            this.qMask.reset({ ...question });
            this.timeProgress.hideProgress();
        }
        selectStyleList[answer] = 'bingo';
        this.answer = answer;
        this.setState({
            question,
            select,
            selectStyleList,
            selectedStyleList: select.map(() => ''), // 已选择样式控制
            gameOver: false // 游戏时间结束
        });
    };
    stepResult = () => {
        const { step } = this.props;
        if (step > this.errorStep) {
            this.climb();
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
        this.canSelect = true; // 选择结束后设置为false
    };
    // 异常进入游戏，获取当前游戏状态
    errorJoin = (climbState, errorStep) => {
        if (window.refuseUp) {
            this.errorStep = errorStep;
            this.climbState = climbState;
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
            gamerList.push({ userId, enName, score: 0, isRight: null });
        }
        this.setState({
            gamerList
        });
    };
    whoCanClimb = ({ userId, isRight }) => {
        let { gamerList, gameOver } = this.state;
        isRight && this.nextUpList.push(userId);
        gamerList = gamerList.map(item => {
            if (item.userId === userId) {
                return { ...item, isRight: isRight };
            }
            return item;
        });
        this.setState({
            gamerList
        });
        if (gameOver) {
            this.climb();
        }
    };
    climb = () => {
        const monkeyList = [];
        let total = 0;
        const gamerList = this.state.gamerList.map((item, index) => {
            if (this.nextUpList.indexOf(item.userId) >= 0) {
                monkeyList.push(this.comList[index]);
                total += item.score + 1;
                return { ...item, score: item.score + 1, isRight: null };
            } else {
                total += item.score;
                return { ...item, isRight: null };
            }
        });
        monkeyList.forEach(item => {
            item.play();
            delayToDo(item.stop, 1);
        });
        this.setState({
            gamerList
        });
        if (total > 0) {
            clientApi.serverSave({
                climbState: gamerList,
                errorStep: this.props.step
            });
        }
        this.nextUpList.length = 0;
    };
    choice = section => {
        if (window.refuseUp) return;
        const { gameOver } = this.state;
        if (this.canSelect && !gameOver) {
            const { selectedStyleList } = this.state;
            selectedStyleList[section] = 'selected show-result';
            selectedStyleList[this.answer] = 'selected show-result';
            clientApi.broadcast({
                callBackFnName: 'whoCanClimb',
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
    render() {
        const {
            select = [],
            gamerList = [],
            selectStyleList = [],
            selectedStyleList = [],
            gameOver,
            question = {},
            questionList = [],
            questionTotal
        } = this.state;
        return (
            <div className="game-climb">
                <TimeProgress
                    setTime={this.setTime}
                    delayTime={this.delayTime}
                    showResult={this.stepResult}
                    startGame={this.startGame}
                    styleType={1}
                    study={true}
                    showCountNum={true}
                    ref={com => (this.timeProgress = com)}
                />
                <QuestionTier ref={com => (this.qMask = com)} {...question} />
                {/* {question.question ? <QuestionTier {...question} /> : null} */}
                {gamerList.map((item, index) => {
                    return (
                        <div className="game-box" key={`gamer${index}`}>
                            <div className="climb-box">
                                <Apng
                                    style={{ bottom: `${item.score * 10}%` }}
                                    className="monkey"
                                    src={monkey}
                                    rate={2}
                                    ref={com => (this.comList[index] = com)}
                                />
                            </div>
                            <div
                                className={`name-box ${item.win ? 'win' : ''}`}
                            >
                                <div>{item.enName}</div>
                            </div>
                            <div className="score-box">
                                {typeof item.isRight === 'boolean' ? (
                                    <div
                                        className={`result-mask ${
                                            item.isRight ? 'right' : 'wrong'
                                        }`}
                                    />
                                ) : null}
                                <div
                                    className="score-list"
                                    style={{
                                        opacity:
                                            typeof item.isRight === 'boolean'
                                                ? 0
                                                : 1,
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
                    );
                })}
                <div className="select-box">
                    {select.length > 1 ? (
                        <div>
                            {select.map((item, index) => {
                                return (
                                    <div
                                        key={`q${index}`}
                                        className={`select-item ${
                                            selectStyleList[index]
                                        } ${gameOver ? 'show-result' : ''} ${
                                            selectedStyleList[index]
                                        }`}
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
                    ) : (
                        <div>
                            <div
                                className="select-item"
                                style={{
                                    backgroundImage: `url(${select[0]})`
                                }}
                            />
                            <div
                                className={`select-btn yes  ${
                                    selectStyleList[0]
                                } ${gameOver ? 'show-result' : ''} ${
                                    selectedStyleList[0]
                                }`}
                                onClick={() => {
                                    this.choice(0);
                                }}
                            >
                                <div className="select-mask" />
                            </div>
                            <div
                                className={`select-btn no ${
                                    selectStyleList[1]
                                } ${gameOver ? 'show-result' : ''} ${
                                    selectedStyleList[1]
                                }`}
                                onClick={() => {
                                    this.choice(1);
                                }}
                            >
                                <div className="select-mask" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
