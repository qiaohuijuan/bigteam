import pk1 from '../static/images/pk1.jpg';
import pk2 from '../static/images/pk2.jpg';
import pk3 from '../static/images/pk3.jpg';
import pk4 from '../static/images/pk4.jpg';
import pk5 from '../static/images/pk5.jpg';
import pk6 from '../static/images/pk6.jpg';
import pk7 from '../static/images/pk7.jpg';
import pk8 from '../static/images/pk8.jpg';
import pk9 from '../static/images/pk9.jpg';
import pk10 from '../static/images/pk10.jpg';
import pk11 from '../static/images/pk11.jpg';
import pk12 from '../static/images/pk12.jpg';
import pk13 from '../static/images/pk13.jpg';
import pk14 from '../static/images/pk14.jpg';
import pk15 from '../static/images/pk15.jpg';

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

// 猴子爬藤  yes=0 no=1
export const climbWordIndex = 64;
const climbWordTextList = [
    `Is this a snowy owl?`,
    `Is this snow?`,
    `Does it snatch?`,
    `Does it flap?`,
    `Does it swoop?`,
    `Does it hide?`,
    `Does it glide?`,
    `Do they listen?`,
    `Does it hoot?`,
    `Does it hide?`
];
export const climbWordList = [
    {
        select: [w1_1],
        answer: 0,
        text: climbWordTextList[0]
    },
    {
        select: [pk1],
        answer: 1,
        text: climbWordTextList[1]
    },
    {
        select: [w9_1],
        answer: 0,
        text: climbWordTextList[2]
    },
    {
        select: [pk2],
        answer: 1,
        text: climbWordTextList[3]
    },
    {
        select: [pk3],
        answer: 1,
        text: climbWordTextList[4]
    },
    {
        select: [pk4],
        answer: 1,
        text: climbWordTextList[5]
    },
    {
        select: [w7_1],
        answer: 0,
        text: climbWordTextList[6]
    },
    {
        select: [pk5],
        answer: 1,
        text: climbWordTextList[7]
    },
    {
        select: [w3_1],
        answer: 0,
        text: climbWordTextList[8]
    },
    {
        select: [w4_1],
        answer: 0,
        text: climbWordTextList[9]
    }
];
// 点球大战
export const footballWordIndex = 85;
const footballWordTextList = [
    `Which is the 'snowy owl'?`,
    `Which picture shows us 'listen'?`,
    `Which picture shows us 'snatch'?`,
    `Which picture shows us 'hoot'?`,
    `Which picture shows us 'glide'?`,
    `Which picture shows us 'flap'?`,
    `Which picture shows us 'hide'?`,
    `Which picture shows us 'swoop'?`,
    `Which is the 'snow'?`,
    `Which picture shows us 'hoot'?`
];
export const footballWordList = [
    {
        select: [w1_1, pk6],
        answer: 0,
        text: footballWordTextList[0]
    },
    {
        select: [w5_1, pk7],
        answer: 0,
        text: footballWordTextList[1]
    },
    {
        select: [w4_1, w9_1],
        answer: 1,
        text: footballWordTextList[2]
    },
    {
        select: [w3_1, pk8],
        answer: 0,
        text: footballWordTextList[3]
    },
    {
        select: [pk9, w7_1],
        answer: 1,
        text: footballWordTextList[4]
    },
    {
        select: [w6_1, pk10],
        answer: 0,
        text: footballWordTextList[5]
    },
    {
        select: [pk11, w4_1],
        answer: 1,
        text: footballWordTextList[6]
    },
    {
        select: [w8_1, pk12],
        answer: 0,
        text: footballWordTextList[7]
    },
    {
        select: [pk13, pk14],
        answer: 0,
        text: footballWordTextList[8]
    },
    {
        select: [w5_1, pk15],
        answer: 1,
        text: footballWordTextList[9]
    }
];
// 小狗过桥
export const dogBridgeList = {
    '17': [
        {
            eng: wordList[0],
            img: w1_1,
            letters: ['sn', 'owy', ' ', 'o', 'wl']
        },
        {
            eng: wordList[1],
            img: w2_1,
            letters: ['s', 'n', 'o', 'w', '']
        },
        {
            eng: wordList[2],
            img: w3_1,
            letters: ['h', 'o', 'o', 't', '']
        }
    ],
    '36': [
        {
            eng: wordList[3],
            img: w4_1,
            letters: ['h', 'i', 'd', 'e', '']
        },
        {
            eng: wordList[4],
            img: w5_1,
            letters: ['l', 'i', 's', 't', 'en']
        },
        {
            eng: wordList[5],
            img: w6_1,
            letters: ['f', 'l', 'a', 'p', '']
        }
    ],
    '55': [
        {
            eng: wordList[6],
            img: w7_1,
            letters: ['g', 'l', 'i', 'd', 'e']
        },
        {
            eng: wordList[7],
            img: w8_1,
            letters: ['s', 'w', 'o', 'o', 'p']
        },
        {
            eng: wordList[8],
            img: w9_1,
            letters: ['s', 'n', 'a', 't', 'ch']
        }
    ]
};
export const dogBridge = {
    '18': {
        ...dogBridgeList['17'][0],
        study: true
    },
    '19': {
        ...dogBridgeList['17'][0]
    },
    '20': {
        ...dogBridgeList['17'][1],
        study: true
    },
    '21': {
        ...dogBridgeList['17'][1]
    },
    '22': {
        ...dogBridgeList['17'][2],
        study: true
    },
    '23': {
        ...dogBridgeList['17'][2]
    },
    '37': {
        ...dogBridgeList['36'][0],
        study: true
    },
    '38': {
        ...dogBridgeList['36'][0]
    },
    '39': {
        ...dogBridgeList['36'][1],
        study: true
    },
    '40': {
        ...dogBridgeList['36'][1]
    },
    '41': {
        ...dogBridgeList['36'][2],
        study: true
    },
    '42': {
        ...dogBridgeList['36'][2]
    },
    '56': {
        ...dogBridgeList['55'][0],
        study: true
    },
    '57': {
        ...dogBridgeList['55'][0]
    },
    '58': {
        ...dogBridgeList['55'][1],
        study: true
    },
    '59': {
        ...dogBridgeList['55'][1]
    },
    '60': {
        ...dogBridgeList['55'][2],
        study: true
    },
    '61': {
        ...dogBridgeList['55'][2]
    }
};
