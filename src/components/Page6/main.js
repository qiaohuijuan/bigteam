import React from 'react';
import GameClimb from '../../template/GameClimb/main';
import { getPageIndex } from '../../utils/tools';
import { climbWordList, climbWordIndex } from '../../data/gameWordList';

const Page6 = ({ match }) => {
    return (
        <GameClimb
            step={getPageIndex() - climbWordIndex}
            wordList={climbWordList}
        />
    );
};

export default Page6;
