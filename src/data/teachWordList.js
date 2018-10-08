import w1 from '../static/images/w1.jpg';
import w2 from '../static/images/w2.jpg';
import w3 from '../static/images/w3.jpg';
import w4 from '../static/images/w4.jpg';
import w5 from '../static/images/w5.jpg';
import w6 from '../static/images/w6.jpg';
import w7 from '../static/images/w7.jpg';
import w8 from '../static/images/w8.jpg';
import w9 from '../static/images/w9.jpg';

import w1_1 from '../static/images/w1_1.jpg';
import w2_1 from '../static/images/w2_1.jpg';
import w3_1 from '../static/images/w3_1.jpg';
import w4_1 from '../static/images/w4_1.jpg';
import w5_1 from '../static/images/w5_1.jpg';
import w6_1 from '../static/images/w6_1.jpg';
import w7_1 from '../static/images/w7_1.jpg';
import w8_1 from '../static/images/w8_1.jpg';
import w9_1 from '../static/images/w9_1.jpg';

import wordList from './wordList';

// 单词跟读
const readWord = [
    {
        type: 1,
        text: wordList[0],
        bg: w1,
        delayTime: 0,
        setTime: 5
    },
    {
        type: 1,
        text: wordList[1],
        bg: w2,
        delayTime: 0,
        setTime: 5
    },
    {
        type: 1,
        text: wordList[2],
        bg: w3,
        delayTime: 0,
        setTime: 5
    },
    {
        type: 1,
        text: wordList[3],
        bg: w4,
        delayTime: 0,
        setTime: 5
    },
    {
        type: 1,
        text: wordList[4],
        bg: w5,
        delayTime: 0,
        setTime: 5
    },
    {
        type: 1,
        text: wordList[5],
        bg: w6,
        delayTime: 0,
        setTime: 5
    },
    {
        type: 1,
        text: wordList[6],
        bg: w7,
        delayTime: 0,
        setTime: 5
    },
    {
        type: 1,
        text: wordList[7],
        bg: w8,
        delayTime: 0,
        setTime: 5
    },
    {
        type: 1,
        text: wordList[8],
        bg: w9,
        delayTime: 0,
        setTime: 5
    }
];

export const readWordList = {
    '5': {
        ...readWord[0],
        study: true
    },
    '6': {
        ...readWord[0]
    },
    '9': {
        ...readWord[1],
        study: true
    },
    '10': {
        ...readWord[1]
    },
    '13': {
        ...readWord[2],
        study: true
    },
    '14': {
        ...readWord[2]
    },
    '24': {
        ...readWord[3],
        study: true
    },
    '25': {
        ...readWord[3]
    },
    '28': {
        ...readWord[4],
        study: true
    },
    '29': {
        ...readWord[4]
    },
    '32': {
        ...readWord[5],
        study: true
    },
    '33': {
        ...readWord[5]
    },
    '43': {
        ...readWord[6],
        study: true
    },
    '44': {
        ...readWord[6]
    },
    '47': {
        ...readWord[7],
        study: true
    },
    '48': {
        ...readWord[7]
    },
    '51': {
        ...readWord[8],
        study: true
    },
    '52': {
        ...readWord[8]
    }
};
// 单词总结
const word = [
    [
        { img: w1_1, text: wordList[0] },
        { img: w2_1, text: wordList[1] },
        { img: w3_1, text: wordList[2] }
    ],
    [
        { img: w4_1, text: wordList[3] },
        { img: w5_1, text: wordList[4] },
        { img: w6_1, text: wordList[5] }
    ],
    [
        { img: w7_1, text: wordList[6] },
        { img: w8_1, text: wordList[7] },
        { img: w9_1, text: wordList[8] }
    ]
];

export const conclusionList = {
    '106': {
        images: word[0],
        show: 0
    },
    '107': {
        images: word[0],
        show: 1
    },
    '108': {
        images: word[0],
        show: 2
    },
    '109': {
        images: word[1],
        show: 0
    },
    '110': {
        images: word[1],
        show: 1
    },
    '111': {
        images: word[1],
        show: 2
    },
    '112': {
        images: word[2],
        show: 0
    },
    '113': {
        images: word[2],
        show: 1
    },
    '114': {
        images: word[2],
        show: 2
    }
};
