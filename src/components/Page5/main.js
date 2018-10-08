import React from 'react';
import { testWordList } from '../../data/testWordList';
import { getPageIndex } from '../../utils/tools';
import SquirrelSelect from '../../template/SquirrelSelect/main';
const Page5 = () => {
    const pageIndex = getPageIndex();
    return (
        <div>
            <SquirrelSelect word={testWordList[pageIndex]} />
        </div>
    );
};

export default Page5;
