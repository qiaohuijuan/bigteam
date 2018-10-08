import React from 'react';
import LoadComponent from './loadComponent';

import './style.less';

import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { getPageIndex } from '../../utils/tools';
import preloadImg from '../../utils/preloadImg';
import { apiDefine } from '../../api/web';
import {
    COURSE_PAGE_COUNT,
    COURSE_URL,
} from '../../constants';

class RouteComponent extends React.Component {
    constructor() {
        super();
        this.pageIndex = getPageIndex();
        this.pageCount = COURSE_PAGE_COUNT;
        this.safeChangePage = true;
        let debugPageList = new Array(this.pageCount)
            .fill(1)
            .map((item, index) => index + 1);
        this.state = {
            debug: false,
            debugPageList,
            debugPage: this.pageIndex
        };
        this.init = false;
        this.lastItem = null;
        window.refuseUp = true;
    }

    componentDidMount() {
        LoadComponent.forEach(item => {
            if (typeof item === 'function') {
                item.preload();
            } else {
                item.com && item.com.preload();
            }
        });
        // 暴露翻页方法给客户端
        apiDefine(
            { apiName: 'pageTo', fn: this.changePage },
            { apiName: 'passInformation', fn: this.passInformation }
        );
        preloadImg();
    }
    // debug翻页
    nextPage = () => {
        if (!this.safeChangePage) return;
        if (this.pageIndex < this.pageCount) {
            this.pageIndex++;
        } else {
            return;
        }
        this.setState({
            debugPage: this.pageIndex
        });
        this.changePage(JSON.stringify({ pageIndex: this.pageIndex }));
    };
    // debug翻页
    prevPage = () => {
        if (!this.safeChangePage) return;
        if (this.pageIndex > 1) {
            this.pageIndex--;
        } else {
            return;
        }
        this.setState({
            debugPage: this.pageIndex
        });
        this.changePage(JSON.stringify({ pageIndex: this.pageIndex }));
    };

    //  客户端调用方法
    passInformation = dataStr => {
        const data = dataStr && JSON.parse(dataStr);
        window.passInformation = data;
        if (!this.init) {
            const { debug } = data;
            this.init = true;
            this.setState({
                debug
            });
        }
        return 'a';
    };

    // debug跳页
    debugChangePage = e => {
        const page = e.target.value;
        this.setState({ debugPage: page });
        this.pageIndex = page;
        this.changePage(JSON.stringify({ pageIndex: this.pageIndex }));
    };

    changePage = dataStr => {
        window.refuseUp = false;
        const { pageIndex } = JSON.parse(dataStr);
        const currentIndex = getPageIndex();
        const { history } = this.props;
        if (!this.safeChangePage) {
            return JSON.stringify({
                pageIndex: currentIndex,
                pageTotal: this.pageCount
            });
        }
        if (pageIndex < 1 || pageIndex > this.pageCount) {
            this.safeChangePage = true;
            return JSON.stringify({
                pageIndex: currentIndex,
                pageTotal: this.pageCount
            });
        }
        history.push({
            pathname: `${COURSE_URL}/page${pageIndex}`,
            search: `${window.location.search}`,
            state: {
                pageIndex
            }
        });
        this.safeChangePage = false;
        setTimeout(() => {
            this.safeChangePage = true;
        }, 1000);
        return JSON.stringify({
            pageIndex: pageIndex,
            pageTotal: this.pageCount
        });
    };
    render() {
        const { debug } = this.state;
        return (
            <div className="container">
                <Switch>
                    {LoadComponent.map((item, index) => {
                        if (typeof item === 'function') {
                            return (
                                <Route
                                    key={`page${index + 1}`}
                                    path={`${COURSE_URL}/page${index + 1}`}
                                    component={item}
                                />
                            );
                        } else {
                            return (
                                <Route
                                    key={`page${index + 1}`}
                                    path={`${COURSE_URL}/page(${item.rangeIndex.join(
                                        '|'
                                    )})`}
                                    component={item.com}
                                />
                            );
                        }
                    })}
                    <Redirect
                        exact
                        from={COURSE_URL}
                        to={`${COURSE_URL}/page1${window.location.search}`}
                    />
                </Switch>
                {debug ? (
                    <button
                        onClick={this.prevPage}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            zIndex: 1000
                        }}
                    >
                        上一页
                    </button>
                ) : null}
                {debug ? (
                    <select
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0
                        }}
                        value={this.state.debugPage}
                        onChange={this.debugChangePage}
                    >
                        {this.state.debugPageList.map(item => (
                            <option key={`page${item}`}>{item}</option>
                        ))}
                    </select>
                ) : null}
                {debug ? (
                    <button
                        onClick={this.nextPage}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            zIndex: 1000
                        }}
                    >
                        下一页
                    </button>
                ) : null}
            </div>
        );
    }
}

export default withRouter(RouteComponent);
