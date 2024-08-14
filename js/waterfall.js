const imgWidth = 300;
const gap = 25;
const waterfall = document.querySelector(".waterfall");
window.addEventListener('load', layout);
window.addEventListener('resize',layout);
function layout() {
    function getColumn() {
        let waterfallWidth = waterfall.offsetWidth;
        let column = Math.floor(waterfallWidth / imgWidth);
        return column
    }
    let column = getColumn();
    let nextTop = new Array(column).fill(0);
    function getMinTop(nextTop) {
        let min = nextTop[0], index = 0;
        for (let i = 1; i < nextTop.length; i++) {
            if (nextTop[i] < min) {
                min = nextTop[i];
                index = i;
            }
        }
        return {
            min: min,
            index: index,
        };
    }
    function getMaxTop(nextTop) {
        let max = nextTop[0], index = 0;
        for (let i = 1; i < nextTop.length; i++) {
            if (nextTop[i] > max) {
                max = nextTop[i];
                index = i;
            }
        }
        return {
            max: max,
            index: index,
        };
    }
    for (let i = 0; i < waterfall.children.length; i++) {
        const img = document.querySelector(`.waterfall .waterfall-item:nth-child(${i + 1})`);
        let minTop = getMinTop(nextTop);
        img.style.position = 'absolute';
        img.style.left = `${minTop.index * (imgWidth + gap) + (waterfall.offsetWidth - column * imgWidth  - column * gap + gap) / 2}px`;
        img.style.top = `${minTop.min + gap / 2}px`;
        img.style.display = "block";
        nextTop[minTop.index] += img.offsetHeight + gap;
    }
    let maxTop = getMaxTop(nextTop);
    waterfall.style.height = `${maxTop.max}px`;
}

