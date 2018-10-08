import React, { Component } from 'react';
import './style.less';

/**
 *遮罩层
 * @class
 * @param {object} question 问题
 * @param {number, string number} showTime 等待显示时间
 * @param {number, string number} hideTime 等待隐藏时间，可不传 ，默认为0。
 * @param {boolean} reset  是否重置动画 true 重置
 * @param {boolean} maskVisible 蒙层是否显示 true 显示  false 隐藏
 * @param {string} className  自定义样式
 * maskVisible >  reset = showAnim > showTime = hideTime
 * @extends {Component}
 */

export default class QuestionTier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initProps: { showTime: 5, hideTime: 0, showAnim: false },
            TimeoutObj: function(props) {
                // 自定义设置和清除定时器
                this.setTimeout = props && props.setTimeout;
                this.clearTimeout = () => {
                    if (this.setTimeout) {
                        clearTimeout(this.setTimeout);
                    }
                    this.setTimeout = null;
                };
            },
            objContent: {}, //
            maskVisible: null // 蒙层是否显示
        };
    }
    componentDidMount() {
        this.init(this.props);
    }
    componentWillUnmount() {
        this.resetTimeout(null, 'unmount');
    }
    // 初始化动画
    init(props) {
        let { initProps } = this.state;
        let obj = { ...initProps, ...props };
        let { showTime, hideTime, maskVisible, showAnim, reset } = obj;
        if (showAnim && reset && !this.jusType(maskVisible, 'Boolean')) {
            // 有重置需求时
            // if(showAnim && reset && maskVisible !== true && maskVisible !== false){
            this.setState(
                { maskVisible: false },
                this.setAnim(showTime, hideTime)
            );
        } else if (showAnim && !this.jusType(maskVisible, 'Boolean')) {
            // 只传showAnim
            this.setAnim(showTime, hideTime);
        } else {
            this.setState({ maskVisible });
        }
    }
    // 隐藏问题板
    hide() {
        this.resetTimeout(() => this.setState({ maskVisible: false }));
    }
    // 重置问题板
    reset(param) {
        this.resetTimeout(() => this.init(param));
    }
    // maskVisible，根据maskVisible控制蒙层何时显示。
    // reset，重置动画
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps && this.jusType(nextProps.maskVisible, 'Boolean')) {
    //         this.resetTimeout(() =>
    //             this.setState({ maskVisible: nextProps.maskVisible })
    //         );
    //     } else if (nextProps && nextProps.reset) {
    //         this.resetTimeout(() => this.init(nextProps));
    //     }
    // }
    // 设置蒙层动画
    setAnim(showTime, hideTime) {
        let { TimeoutObj, objContent } = this.state;
        let self = this;
        if (isNaN(showTime) || isNaN(hideTime)) {
            throw new Error('time must be number');
        } else {
            // 享元模式 如果已存在，则不需要重新new对象
            if (
                objContent &&
                this.jusType(objContent, 'Object') &&
                Object.keys(objContent).length > 0
            ) {
                objContent.show.setTimeout = setTimeout(() => {
                    self.setState(
                        { maskVisible: true },
                        objContent.show.clearTimeout
                    );
                }, Number(showTime) * 1000);
                objContent.hide.setTimeout = setTimeout(() => {
                    self.setState(
                        { maskVisible: false },
                        objContent.hide.clearTimeout
                    );
                }, Number(hideTime) * 1000);
            } else {
                let show = new TimeoutObj({
                    setTimeout: setTimeout(() => {
                        self.setState({ maskVisible: true }, show.clearTimeout);
                    }, Number(showTime) * 1000)
                });
                let hide = new TimeoutObj({
                    setTimeout: setTimeout(() => {
                        self.setState(
                            { maskVisible: false },
                            hide.clearTimeout
                        );
                    }, Number(hideTime) * 1000)
                });
                objContent.show = show;
                objContent.hide = hide;
            }
            self.setState({ objContent });
        }
    }
    // 清除定时器
    resetTimeout(callback, flag) {
        let { objContent } = this.state;
        if (this.jusType(objContent, 'Object')) {
            for (let i in objContent) {
                if (objContent.hasOwnProperty(i)) {
                    objContent[i].clearTimeout();
                }
            }
            if (flag !== 'unmount') {
                this.setState({ objContent }, callback);
            }
        } else {
            callback && callback();
        }
    }
    // 判断参数数据类型
    jusType = (param, type) =>
        Object.prototype.toString.call(param) === '[object ' + type + ']';

    render() {
        let { maskVisible } = this.state;
        let { className } = this.props;
        let format_className = this.jusType(className, 'String')
            ? ' ' + className
            : '';
        return (
            <div
                className={'QuestionTier' + format_className}
                style={!maskVisible ? { display: 'none' } : null}
            >
                <div className="tier" />
                <p
                    className="tier-question"
                    dangerouslySetInnerHTML={{ __html: this.props.question }}
                />
            </div>
        );
        // return ReactDOM.createPortal(
        //     <div className={ 'QuestionTier'+ format_className } style = { !maskVisible ? { display : 'none' } : null }>
        //         <div className="tier"></div>
        //         <p className='tier-question' dangerouslySetInnerHTML={{ __html: this.props.question }} />
        //     </div>,
        //     document.body
        // );
    }
}
