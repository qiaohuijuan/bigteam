import React from 'react';
import './style.less';

const Conclusion = ({ title = '', show, images = [] }) => {
    return (
        <div className="conclusion-tpl">
            <div className="conclusion-img-box">
                {images.map((item, index) => (
                    <div
                        key={`conclusion${index}`}
                        className={`conclusion-img ${
                            index === show ? '' : 'show-mask'
                        }`}
                    >
                        <img src={item.img} alt="总结图片" />
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Conclusion;
