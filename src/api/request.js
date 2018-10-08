import UA from '../utils/ua';

let iosSend = data => {
    if (!window.webkit) {
        return;
    }
    window.webkit.messageHandlers.jsCallNative.postMessage(
        JSON.stringify(data)
    );
};

let windowSend = data => {
    if (!window.bridge) {
        return;
    }
    window.bridge.postMessage(JSON.stringify(data));
};

let androidSend = data => {
    if (!window.JsToAndroid) {
        return;
    }
    window.JsToAndroid.postMessage(JSON.stringify(data));
};
let syncIosSend = data => {
    if (!prompt) return;
    return prompt(JSON.stringify(data));
};

let syncWindowSend = data => {
    if (!prompt) return;
    return prompt(JSON.stringify(data));
};

let syncAndroidSend = data => {
    if (!window.JsToAndroid) {
        return;
    }
    return window.JsToAndroid.prompt(JSON.stringify(data));
};

const createNewTask = (tag, params = {}) => {
    console.log('params', {
        msgTag: tag,
        ...params
    });
    const data = {
        msgTag: tag,
        ...params
    };
    if (UA.ios) {
        iosSend(data);
    } else if (UA.android) {
        androidSend(data);
    } else if (UA.winClient) {
        windowSend(data);
    }
};
const createSyncNewTask = (tag, params = {}) => {
    console.log('params', {
        msgTag: tag,
        ...params
    });
    const data = {
        msgTag: tag,
        ...params
    };
    if (UA.ios) {
        return syncIosSend(data);
    } else if (UA.android) {
        return syncAndroidSend(data);
    } else if (UA.winClient) {
        return syncWindowSend(data);
    }
};

export { createNewTask, createSyncNewTask };
