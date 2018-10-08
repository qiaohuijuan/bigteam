import React from 'react';
import GameFootball from '../../template/GameFootball/main';
import { getPageIndex } from '../../utils/tools';
import { footballWordList, footballWordIndex } from '../../data/gameWordList';

const Page9 = ({ match }) => {
    return (
        <GameFootball
            step={getPageIndex() - footballWordIndex}
            wordList={footballWordList}
        />
    );
};

export default Page9;
