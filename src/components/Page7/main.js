import React from 'react';
import GameDogBridge from '../../template/GameDogBridge/show';
import { getPageIndex } from '../../utils/tools';
import { dogBridgeList } from '../../data/gameWordList';

const Page7 = () => {
    const pageIndex = getPageIndex();
    return <GameDogBridge dogBridgeList={dogBridgeList[pageIndex]} />;
};

export default Page7;
