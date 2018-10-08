import { createNewTask, createSyncNewTask } from './request';

const API_TAG = {
    STAGE: 'stage',
    EVALUATE: 'evaluate',
    AWARD: 'award',
    CHOICE: 'choice',
    CHOICE_WIN: 'choiceWin',
    MONITOR_VOLUME: 'monitorVolume',
    PLAY_SOUND: 'playSound',
    COUNT_DOWN: 'countDown',
    GET_ALL_INFO: 'getAllPersonsInfomation', // 单词错误但不能修改
    BROADCAST: '4001',
    SERVER_SAVE: '3001'
};

const clientApi = {
    stage: function(params) {
        createNewTask(API_TAG.STAGE, params);
    },
    evaluate: function(params) {
        createNewTask(API_TAG.EVALUATE, params);
    },
    award: function(params) {
        createNewTask(API_TAG.AWARD, params);
    },
    choice: function(params) {
        createNewTask(API_TAG.CHOICE, params);
    },
    choiceWin: function(params) {
        createNewTask(API_TAG.CHOICE_WIN, params);
    },
    monitorVolume: function(params) {
        createNewTask(API_TAG.MONITOR_VOLUME, params);
    },
    playSound: function(params) {
        createNewTask(API_TAG.PLAY_SOUND, params);
    },
    countDown: function(params) {
        createNewTask(API_TAG.COUNT_DOWN, params);
    },
    broadcast: function(params) {
        const re = createSyncNewTask(API_TAG.BROADCAST, params);
        return re && JSON.parse(re);
    },
    serverSave: function(params) {
        const re = createSyncNewTask(API_TAG.SERVER_SAVE, params);
        return re && JSON.parse(re);
    },
    getAllPersonsInfomation: function(params) {
        const re = createSyncNewTask(API_TAG.GET_ALL_INFO, params);
        return re && JSON.parse(re);
    }
};

export default clientApi;
