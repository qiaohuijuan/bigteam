import React from 'react';
import Blackboard from '../../template/Blackboard/main';
import { getPageIndex } from '../../utils/tools';
const transitionList = { '2': 1, '4': 2 };

const Page2 = () => {
    const pageIndex = getPageIndex();
    return (
        <div>
            <Blackboard type={transitionList[pageIndex]} />
        </div>
    );
};

export default Page2;
