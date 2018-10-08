import React, { Component } from 'react';
import './style.less';

export default class GameDogBridgeShow extends Component {
    render() {
        const wordsItem = this.props.dogBridgeList.map((ele, index) => {
            return (
                <div className="words-item" key={index}>
                    <div
                        className="top"
                        style={{ backgroundImage: `url(${ele.img})` }}
                    />
                    <div className="bottom">
                        <div className="eng">{ele.eng}</div>
                        <div className="chi">{ele.chi}</div>
                    </div>
                </div>
            );
        });
        return (
            <div className={`game-dogBridge step1`}>
                <div className="reward" />
                <div className="words-wrap">{wordsItem}</div>
            </div>
        );
    }
}
