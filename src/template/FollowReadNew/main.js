import React from 'react';
import Recorder from '../Recorder/main';
import './style.less';

/**
 * 单词句子展示跟读回答组件
 * @class FollowRead
 * @param {string} bg 背景图片
 * @param {object} word 单词信息
 * @param {number} word.type 类型 0-展示 1-跟读 2-问答
 * @param {string} word.text 显示文本
 * @param {string} [word.title] 标题艺术字
 * @param {string} [word.textType] 录音文本类型 word-单词 sentence-句子
 * @param {string} [word.audioText] 录音文本，如不传则为显示文本
 * @param {string} word.desc 单词（句子）介绍
 * @param {string} word.pic 单词（句子）图片
 * @param {number} [word.delayTime=3] 延迟录音时间
 * @param {number} [word.setTime=10] 录音时间
 * @param {boolean} [word.wide] 单词图片是否为宽图
 * @param {number} [word.top] 单词图片定制margin-top
 * @param {number} [word.study] 学习模式
 * @extends {Component}
 */

const FollowRead = props => {
    const { word = {}} = props;
    const {
        bg = '',
        text,
        audioText,
        textType,
        delayTime = 3,
        setTime = 10,
        study
    } = word;
    return (
        <div
            className="follow-read-tpl"
            style={{ backgroundImage: `url(${bg})` }}
        >
            {study ? null : (
                <Recorder
                    type={1}
                    top={860}
                    left={870}
                    text={text}
                    setTime={setTime}
                    audioText={audioText}
                    textType={textType}
                    delayTime={delayTime}
                    study={study}
                />
            )}
        </div>
    );
};
export default FollowRead;
