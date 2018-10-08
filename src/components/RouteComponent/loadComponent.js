import React from 'react';
import Loadable from 'react-loadable';
import { COURSE_PAGE } from '../../constants';

const MyLoadingComponent = ({ isLoading, error }) => {
    if (error) {
        console.log(error);
        return <div>Sorry, there was a problem loading the page(`${JSON.stringify(error)}`).</div>;
    } else {
        return null;
    }
};

let component = COURSE_PAGE.map(
    item => {
        if (typeof item === 'number') {
            return Loadable({
                loader: () => import(`../Page${item}/main`),
                loading: MyLoadingComponent
            });
        } else {
            return {
                com: Loadable({
                    loader: () => import(`../Page${item.page}/main`),
                    loading: MyLoadingComponent
                }),
                rangeIndex: item.rangeIndex
            };
        }
    }
);

export default component;
