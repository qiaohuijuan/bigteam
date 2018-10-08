// 选择题
import c1_1 from '../static/images/c1_1.png';
import c1_2 from '../static/images/c1_2.png';

import c2_1 from '../static/images/c2_1.png';
import c2_2 from '../static/images/c2_2.png';

import c3_1 from '../static/images/c3_1.png';
import c3_2 from '../static/images/c3_2.png';

import c4_1 from '../static/images/c4_1.png';
import c4_2 from '../static/images/c4_2.png';

import c5_1 from '../static/images/c5_1.png';
import c5_2 from '../static/images/c5_2.png';

import c6_1 from '../static/images/c6_1.png';
import c6_2 from '../static/images/c6_2.png';

import c7_1 from '../static/images/c7_1.png';
import c7_2 from '../static/images/c7_2.png';

import c8_1 from '../static/images/c8_1.png';
import c8_2 from '../static/images/c8_2.png';

import c9_1 from '../static/images/c9_1.png';
import c9_2 from '../static/images/c9_2.png';

// 松鼠选择
const questionList = [
    "Which is the 'snowy owl'?",
    "Which is the 'snow'?",
    "Which picture shows us 'hoot'?",
    "Which picture shows us 'hide'?",
    "Which picture shows us 'listen'?",
    "Which picture shows us 'flap'?",
    "Which picture shows us 'glide'?",
    "Which picture shows us 'swoop'?",
    "Which picture shows us 'snatch'?"
];
export const testWordList = {
    '7': {
        question: questionList[0],
        select: [c1_1, c1_2],
        study: true
    },
    '8': {
        select: [c1_1, c1_2],
        answer: 1
    },
    '11': {
        question: questionList[1],
        select: [c2_1, c2_2],
        study: true
    },
    '12': {
        select: [c2_1, c2_2],
        answer: 0
    },
    '15': {
        question: questionList[2],
        select: [c3_1, c3_2],
        study: true
    },
    '16': {
        select: [c3_1, c3_2],
        answer: 0
    },
    '26': {
        question: questionList[3],
        select: [c4_1, c4_2],
        study: true
    },
    '27': {
        select: [c4_1, c4_2],
        answer: 1
    },
    '30': {
        question: questionList[4],
        select: [c5_1, c5_2],
        study: true
    },
    '31': {
        select: [c5_1, c5_2],
        answer: 0
    },
    '34': {
        question: questionList[5],
        select: [c6_1, c6_2],
        study: true
    },
    '35': {
        select: [c6_1, c6_2],
        answer: 0
    },
    '45': {
        question: questionList[6],
        select: [c7_1, c7_2],
        study: true
    },
    '46': {
        select: [c7_1, c7_2],
        answer: 0
    },
    '49': {
        question: questionList[7],
        select: [c8_1, c8_2],
        study: true
    },
    '50': {
        select: [c8_1, c8_2],
        answer: 1
    },
    '53': {
        question: questionList[8],
        select: [c9_1, c9_2],
        study: true
    },
    '54': {
        select: [c9_1, c9_2],
        answer: 1
    }
};
