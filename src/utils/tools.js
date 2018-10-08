// 将对象转化成url参数
export const parseQueryString = url => {
    const reg_url = /\?([\w\W]+)$/;
    const reg_para = /([^&=]+)=([\w\W]*?)(&|$)/g; // g is very important
    const arr_url = reg_url.exec(url);
    const ret = {};
    if (arr_url && arr_url[1]) {
        const str_para = arr_url[1];
        let result = null;
        while ((result = reg_para.exec(str_para)) != null) {
            ret[result[1]] = result[2];
        }
    }
    return ret;
};
// 通过url获取当前页面索引
export const getPageIndex = () => {
    const path = window.location.pathname;
    const page = path.match(/page\d+/);
    const pageIndex = page !== null ? parseInt(page[0].substring(4), 10) : 1;
    return pageIndex;
};
// 准备倒计时
export const formatTime = time => {
    if (time < 60) {
        const s = time < 10 ? '0' + time : time;
        return `00:${s}`;
    } else {
        const m = parseInt(time / 60, 10);
        const s = time - m * 60;
        const mm = m < 10 ? `0${m}` : m;
        const ss = s < 10 ? `0${s}` : s;
        return `${mm}:${ss}`;
    }
};
// 清楚延迟执行函数
let timer = [];
export const delayToDo = (fn, time = 0, ...params) => {
    timer.push(setTimeout(fn, time * 1000, ...params));
};
// 延迟执行函数
export const clearDelay = (fn, time = 0, ...params) => {
    timer.forEach(item => clearTimeout(item));
    timer = [];
};
// 上台机会分配函数

export const whoCanUp = oneSafe => {
    const info = window.passInformation || {};
    let { students = [0, 0, 0, 0], stageIndex = -1 } = info;
    const length = students.filter(item => item === 0).length;
    // 教室无人
    if (length > 3) {
        console.log('教室无人');
        return {};
    }
    // 异常进入，非教师控制进入上台页面，无法上台
    if (window.refuseUp) {
        console.log('异常进入');
        return {};
    }
    // pk上台只有一个学生，第二个将不发送上台信息，防止重复上台。
    if (oneSafe && length > 2) {
        console.log('一个学生');
        return {};
    }
    stageIndex = stageIndex < 3 ? stageIndex + 1 : 0;
    while (students[stageIndex] < 1) {
        if (stageIndex < 3) {
            stageIndex++;
        } else {
            stageIndex = 0;
        }
    }
    window.passInformation.stageIndex = stageIndex;
    return { userId: students[stageIndex], stageIndex };
};
// 洗牌随机
export const privateShuffle = function(array) {
    let m = array.length;
    let i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        [array[m], array[i]] = [array[i], array[m]];
    }
    return array;
};
