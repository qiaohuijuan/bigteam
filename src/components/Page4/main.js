import React from 'react';
import FollowReadNew from '../../template/FollowReadNew/main';
import { readWordList } from '../../data/teachWordList';
import { getPageIndex } from '../../utils/tools';

const Page4 = () => {
    const pageIndex = getPageIndex();
    return (
        <div>
            <FollowReadNew word={readWordList[pageIndex]} />
        </div>
    );
};
export default Page4;
