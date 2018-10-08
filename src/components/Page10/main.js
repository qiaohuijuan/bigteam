import React from 'react';
import Conclusion from '../../template/Conclusion/main';
import { getPageIndex } from '../../utils/tools';
import { conclusionList } from '../../data/teachWordList';

const Page10 = () => {
    const pageIndex = getPageIndex();
    return (
        <div>
            <Conclusion
                show={conclusionList[pageIndex].show}
                images={conclusionList[pageIndex].images}
            />
        </div>
    );
};

export default Page10;
