let webapi = (window.webapi = {});

/**
 * 供客户端调用的接口
 * passInformation:教室信息    参数 teacher-老师名字
 * 定义位置：/src/components/RouteComponent/main
 *
 * pageTo:翻页    参数 pageIndex-页码
 * 定义位置：/src/components/RouteComponent/main
 *
 * evaluateResult:录音反馈  参数 total-总分 result-得分
 * 定义位置：/src/template/readResult/main
 */

export function apiDefine(...params) {
    params.forEach(opt => {
        const { apiName, fn } = opt;
        webapi[apiName] = fn;
    });
}
export function apiCancel(apiName) {
    delete webapi[apiName];
}
