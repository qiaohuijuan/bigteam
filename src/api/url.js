const BASE_URL = 'classroom://';
let sendOver = true;
const linkTo = url => {
    setTimeout(() => {
        window.location.href = url;
        sendOver = true;
        console.log(url);
    }, 300);
};
const checkTask = url => {
    if (sendOver) {
        sendOver = false;
        linkTo(url);
    } else {
        setTimeout(checkTask, 100, url);
    }
};
const createTask = (api, params = {}) => {
    const parameter = JSON.stringify(params);
    const url = `${BASE_URL}${api}?parameter=${parameter}`;
    checkTask(url);
};

export default createTask;
