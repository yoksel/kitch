import {config} from './data/config';


const elementsMap = new Map();

function setSizes() {
    let commonWidth = getWidth();

    elementsMap.set('.wrapper', {
        width: commonWidth.max,
    });
    elementsMap.set('.scene', {
        width: commonWidth.max,
        height: config.verticalGap + config.top.height + config.bottom.height
    });

    elementsMap.set('.block--top', {
        width: commonWidth.top,
        height: config.top.height,
        transform: `translateZ(${config.top.deep}px)`,
    });
    elementsMap.set('.top__top', {
        width: commonWidth.top,
        height: config.top.deep,
    });
    elementsMap.set('.top__bottom', {
        width: commonWidth.top,
        height: config.top.deep,
    });
    elementsMap.set('.top__side', {
        width: config.top.deep,
        height: config.top.height,
    });
    elementsMap.set('.top__front', {
        width: config.top.width,
        height: config.top.height,
    });

    elementsMap.set('.block--bottom', {
        width: commonWidth.bottom,
        height: config.bottom.height,
        transform: `translateZ(${config.bottom.deep}px)`,
    });
    elementsMap.set('.bottom__top', {
        width: commonWidth.bottom,
        height: config.bottom.deep,
    });
    elementsMap.set('.bottom__bottom', {
        width: commonWidth.bottom,
        height: config.bottom.deep,
    });
    elementsMap.set( '.bottom__side', {
        width: config.bottom.deep,
        height: config.bottom.height,
    });
    elementsMap.set('.bottom__front', {
        width: config.bottom.width,
        height: config.bottom.height,
    });
}

// ------------------------------

function getWidth() {
    let widthSets = [
        config.top.width,
        config.bottom.width
    ];

    widthSets = widthSets.map(widthSet => {

        if (typeof widthSet === 'object') {

            widthSet = widthSet.reduce((result, item) => {
                result += item;
                return result;
            }, 0)
        }

        return widthSet;
    });

    return {
        top: widthSets[0],
        bottom: widthSets[1],
        max: Math.max(...widthSets)
    };
}

// ------------------------------

export {elementsMap, setSizes};
