import React, { Component } from 'react';
import clientApi from '../../api/client';
import { delayToDo, clearDelay } from '../../utils/tools';
import QuestionTier from '../QuestionTier/main';
import TimeProgress from '../TimeProgress/main';
import plank_b from '../../static/images/common/plank_b.png';
import plank_a from '../../static/images/common/plank_a.png';
import failed from '../../static/images/common/failed.png';
import success_animation from '../../static/images/common/success_animation.png';
import normal_animation from '../../static/images/common/normal_animation.png';
import platform from '../../static/images/common/platform.png';
import pinecone from '../../static/images/common/pinecone.png';
import './style.less';

/**
 * 选择题题
 * @class SquirrelSelect
 * @param {object} word 单词
 * @param {string} [question='Listen and choose'] 问题
 * @param {string} [desc='请选择正确答案'] 问题说明
 * @param {array} [word.select] 选项图片数组
 * @param {number} [word.answer] 答案（对应选项数组下标）
 * @extends {Component}
 */
// clientApi.award({ awardCount: 1 });
export default class SquirrelSelect extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props,'选择题props')
        this.delayTime = 0; // 延迟开始时间
        this.setTime = 5; // 答题时间
        this.state = {
            // questionTier:undefined,
            //  Tier:false,
            gameStart: false, // 游戏开始
            gameOver: false, // 游戏结束
            selectInitialize: 'block', // 初始化松鼠
            selectA: 'none', // 初始化松鼠选A
            selectB: 'none', // 初始化松鼠选B
            currentChoose: null, // 当前选择的答案
            currentSelected: false, // 是否已经做出答案
            picReplaceTimeout: null, // 松鼠表情变换
            hasChoose: false,
            handleSquirre: false,
            //  reset : false,
        };
    }
    componentWillUnmount() {
        let { picReplaceTimeout } = this.state;
        if (picReplaceTimeout) {
            clearTimeout(picReplaceTimeout);
        }
        clearDelay();
    }
    // 时间计时结束
    showResult = () => {
        let { currentSelected, currentChoose } = this.state;
        let { answer } = this.props.word;
        this.setState({
            gameOver: true,
            hasChoose: true
        });
        delayToDo(() => {
            if (currentSelected) {
                // console.log('已回答',currentChoose,answer,this.props)
                if (currentChoose === answer) {
                    // console.log('回答正确')
                    clientApi.award({ awardCount: 1, title: 'Good job' });
                } else {
                    // console.log('回答错误')
                    clientApi.award({ title: 'Nice try' });
                }
            } else {
                // console.log('未回答')
                clientApi.award({ title: 'Nice try' });
            }
        }, 1);
    };
    // 时间计时开始
    startGame = () => {
        this.setState({
            gameStart: true
        });
    };
    // 判断参数数据类型
    jusType = (param, type) =>
        Object.prototype.toString.call(param) === '[object ' + type + ']';

    // 客户端答题反馈
    selectBack = flag => {
        let { answer } = this.props.word;
        if (answer === flag) {
            // console.log('----1')
            clientApi.playSound({ soundId: 7 });
        } else {
            // console.log('----2')
            clientApi.playSound({ soundId: 8 });
        }
    };

    // 答题开始，选择A选项
    onClickSelectA = () => {
        this.setState(
            {
                selectA: 'block',
                selectB: 'none',
                selectInitialize: 'none',
                currentChoose: 0,
                currentSelected: true,
            },
            () => this.picReplace(0)
        );
        this.selectBack(0);
    };
    // 答题开始，选择B选项
    onClickSelectB = () => {
        this.setState(
            {
                selectB: 'block',
                selectA: 'none',
                selectInitialize: 'none',
                currentChoose: 1,
                currentSelected: true,
            },
            () => this.picReplace(1)
        );
        this.selectBack(1);
    };
    // 500毫秒给出选择反馈，松鼠变换表情
    picReplace = ans => {
        this.setState({
            picReplaceTimeout: setTimeout(() => {
                this.setState({
                    handleSquirre: true,
                    hasChoose: true
                });
            }, 500)
        });
    };
    // 松鼠变换
    squirreFace = obj => {
        let { handleSquirre, gameOver } = this.state;
        let { answer } = this.props.word;
        let { key, className, style, pic } = obj;
        let format_className = this.jusType(className, 'String')
            ? ' ' + className
            : '';
        let format_style = this.jusType(style, 'Object') ? style : {};
        let src =
            !handleSquirre && !gameOver
                ? normal_animation
                : (!gameOver && !handleSquirre) || answer === key
                    ? pic && pic.suc
                    : pic && pic.fail;
        return (
            <img
                alt=""
                className={'squirrel-styleComm' + format_className}
                src={src}
                style={format_style}
            />
        );
    };
    // 选择反馈
    feedBack = key => {
        let { hasChoose, currentChoose } = this.state;
        if (!hasChoose) {
            return null;
        }
        let { answer } = this.props.word;
        let currentAnswer;
        if (currentChoose === null && hasChoose) {
            currentAnswer = answer === key ? 'selected-right' : '';
        } else {
            if (currentChoose === answer) {
                currentAnswer =
                    hasChoose && answer === key ? 'selected-right' : '';
            } else {
                currentAnswer =
                    hasChoose && answer === key
                        ? 'selected-right'
                        : 'selected-wrong';
            }
        }
        return <div className={currentAnswer} />;
    };
    render() {
        let {
            selectInitialize,
            selectA,
            selectB,
            hasChoose,
            currentChoose,
            gameOver
        } = this.state;
        let { question, select, study, answer } = this.props.word;
        let dropPlatform = gameOver ? 'dropAmition' : '';
        let dropFlag =
            (gameOver && currentChoose === answer) ||
            (gameOver && currentChoose !== answer);
        return (
            <div className="squirrel-select">
                {/* { Tier && study? <QuestionTier question = {question}/> : null} */}
                <QuestionTier
                    question={question}
                    showTime={5}
                    showAnim={study}
                />
                <TimeProgress
                    className="timeProgress"
                    mt={35}
                    setTime={this.setTime}
                    delayTime={this.delayTime}
                    showResult={this.showResult}
                    startGame={this.startGame}
                    showCountNum={true}
                    styleType={2}
                    study={study}
                />
                {study ? <div className="study-state" /> : ''}
                <div className="squirrel-box">
                    <div
                        className={
                            'selectA ' +
                            (!study && dropFlag && answer !== 0
                                ? 'dropSelect'
                                : '')
                        }
                        onClick={!hasChoose ? this.onClickSelectA : null}
                    >
                        {this.squirreFace({
                            key: 0,
                            className: 'squirrel-selectA',
                            style: { display: selectA },
                            pic: { suc: success_animation, fail: failed }
                        })}
                        <img
                            alt="plank_a"
                            className="squirrelA"
                            src={plank_a}
                        />
                        <img alt="A" className="selectImgA" src={select[0]} />
                        {this.feedBack(0)}
                    </div>
                    <div
                        className={
                            'selectB ' +
                            (!study && dropFlag && answer !== 1
                                ? 'dropSelect'
                                : '')
                        }
                        onClick={!hasChoose ? this.onClickSelectB : null}
                    >
                        {this.squirreFace({
                            key: 1,
                            className: 'squirrel-selectB',
                            style: { display: selectB },
                            pic: { suc: success_animation, fail: failed }
                        })}
                        <img
                            alt="plank_b"
                            className="squirrelB"
                            src={plank_b}
                        />
                        <img alt="B" className="selectImgB" src={select[1]} />
                        {this.feedBack(1)}
                    </div>
                </div>
                <div className="squirrel-animation">
                    {study || currentChoose !== answer ? (
                        <div className="squerrel-top">
                            <img
                                alt="pinecone"
                                className="squirrel-pinecone"
                                src={pinecone}
                            />
                        </div>
                    ) : null}
                    <div className={`squerrel-bottom ${dropPlatform}`}>
                        {this.squirreFace({
                            style: { display: selectInitialize },
                            pic: { suc: success_animation, fail: failed }
                        })}
                        <img
                            alt=""
                            className="squirrel-platform"
                            src={platform}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
