import React from 'react';
import ImageWord from '../../template/ImageWord/main';
import { getPageIndex } from '../../utils/tools';
import staticImageList from '../../data/staticImageList';

const Page3 = () => {
    const pageIndex = getPageIndex();
    return <ImageWord src={staticImageList[pageIndex]} />;
};

export default Page3;
