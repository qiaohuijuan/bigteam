import React, { Component } from 'react';
import TimeProgress from '../TimeProgress/main';
import clientApi from '../../api/client';
import './style.less';

export default class Prepare extends Component {
    state = {
        btnStyle: ['', ''],
        startChoice: false, //开始选择
        choiceDone: false, //选择完成
        choiceOver: false //选择时间结束
    };
    makeChoice = choice => {
        const { btnStyle, startChoice, choiceDone, choiceOver } = this.state;
        if (!startChoice || choiceDone || choiceOver) return;
        btnStyle[choice] = 'btn-down';
        clientApi.playSound({ soundId: 7 });
        this.setState({
            btnStyle,
            choiceDone: true
        });
    };
    showResult = () => {
        const { choiceDone } = this.state;
        if (choiceDone) {
            clientApi.award({ awardCount: 1 });
        }
        this.setState({
            choiceOver: true
        });
    };
    startGame = () => {
        this.setState({
            startChoice: true
        });
    };
    render() {
        const { btnStyle } = this.state;
        const { question } = this.props;
        const { text, desc, delayTime, setTime, study } = question;
        return (
            <div className="prepare-tpl">
                <TimeProgress
                    mt={35}
                    delayTime={delayTime}
                    setTime={setTime}
                    showResult={this.showResult}
                    startGame={this.startGame}
                    study={study}
                />
                <div className="prepare-text">{text}</div>
                <div className="prepare-desc">{desc}</div>
                <div
                    className={`section section1 ${study ? 'study' : ''} ${
                        btnStyle[0]
                    }`}
                    onClick={() => {
                        this.makeChoice(0);
                    }}
                />
                <div
                    className={`section section2 ${study ? 'study' : ''} ${
                        btnStyle[1]
                    }`}
                    onClick={() => {
                        this.makeChoice(1);
                    }}
                />
            </div>
        );
    }
}
