import React from 'react';
import './style.less';

/**
 * 黑板组件
 * @param {number} type 黑板类型 undefined:空  1:老师介绍  2:知识课堂  3.课堂总结
 * @param {array} text 黑板文字展示
 * @extends {Component}
 */

const Blackboard = ({ type = '', text = [] }) => {
    let showText = text;
    if (type === 1) {
        const info = window.passInformation || {};
        const { teacher = '' } = info;
        showText = [teacher];
    }
    return (
        <div className={`blackboard-tpl type${type}`}>
            <div className="text-box">
                {showText.map((item, index) => (
                    <p key={`text${index}`}>{item}</p>
                ))}
            </div>
        </div>
    );
};

export default Blackboard;
