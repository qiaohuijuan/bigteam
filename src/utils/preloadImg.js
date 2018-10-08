const requireContext = require.context(
    '../static/images/',
    true,
    /.*(png|jpg)$/
);
const images = requireContext.keys().map(requireContext);

const preloadImg = () => {
    window.onload = function() {
        setTimeout(() => {
            images.forEach((item, index) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = item;
            });
        }, 1000);
    };
};
export default preloadImg;
