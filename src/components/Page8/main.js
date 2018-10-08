import React from 'react';
import GameDogBridgePlay from '../../template/GameDogBridge/play';
import { getPageIndex } from '../../utils/tools';
import { dogBridge } from '../../data/gameWordList';

const Page8 = () => {
    const pageIndex = getPageIndex();
    return <GameDogBridgePlay word={dogBridge[pageIndex]} />;
};

export default Page8;
