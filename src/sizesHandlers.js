import {elementsMap, setSizes} from './elementsMap';

const surfaceSizesCss = document.querySelector('.surface-sizes-css');

// ------------------------------

function setSizesStyles() {
    const stylesList = [];
    for([key, values] of elementsMap) {
        const valuesList = [];

        for(var prop in values) {
            const value = values[prop];
            const units = typeof value === 'number' ? 'px' : '';
            const styleItem = `${prop}: ${value}${units}`
            valuesList.push(styleItem);
        }
        stylesList.push(`${key}{${valuesList.join(';\n')}}`);
    }

    surfaceSizesCss.innerHTML = stylesList.join('\n');
}

// ------------------------------

function updateSizes() {
    setSizes();
    setSizesStyles();
}

// ------------------------------

export {setSizes, setSizesStyles, updateSizes};

