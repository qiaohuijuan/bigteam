import React from 'react';

/**
 * @param {string} src 组件背景图片
 * @extends {Component}
 */

const ImageWord = ({ src = '' }) => {
    return (
        <div
            className="images-word-tpl"
            style={{ backgroundImage: `url(${src})` }}
        />
    );
};

export default ImageWord;
