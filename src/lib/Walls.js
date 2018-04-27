import Mustache from 'Mustache';
import {config} from '../data/config';
import {setDefaults, elementStyles} from './elementStyles';

const wallTmpl = document.getElementById('wall-tmpl').innerHTML;
const wallsElem = document.querySelector('.walls');
let wallsList = [];

class Wall {
    constructor(params) {
        const key = params.key;
        const isLast = params.isLast;
        const wallConfig = config.walls[key];
        wallConfig.verticalGap = config.verticalGap;

        let view = {
            side: key,
            params: wallConfig,
            lines: [
                {
                    line: 'top',
                    blocks: wallConfig.top.width.map((block, i) => {
                        block.pos = i;

                        if (i === wallConfig.top.width.length - 1) {
                            block.height = isLast ? wallConfig.top.height : ''
                        }

                        return block;
                    })
                },
                {
                    line: 'bottom',
                    blocks: wallConfig.bottom.width.map((block, i) => {
                        block.pos = i;

                        if (i === wallConfig.bottom.width.length - 1) {
                            block.height = isLast ? wallConfig.bottom.height : ''
                        }

                        return block;
                    })
                },
            ]
        };
        console.log(view);

        this.elementStyles = new elementStyles(key);
        this.stylesElem = document.createElement('style');
        document.head.appendChild(this.stylesElem);

        this.output = Mustache.render(wallTmpl, view);

        this.setSizesStyles();
    }

    // ------------------------------

    setSizesStyles() {
        const stylesList = [];
        for([key, values] of this.elementStyles.stylesMap) {
            const valuesList = [];

            for(var prop in values) {
                const value = values[prop];
                const units = typeof value === 'number' ? 'px' : '';
                const styleItem = `${prop}: ${value}${units}`
                valuesList.push(styleItem);
            }
            stylesList.push(`${key}{${valuesList.join(';\n')}}`);
        }

        this.stylesElem.innerHTML = stylesList.join('\n');
    }


};

// ------------------------------

function updateSizes() {
    console.log(wallsList);
    setDefaults();

    wallsList.forEach(wall => {
        wall.elementStyles.setSizesToElems();
        wall.setSizesStyles();
    })
    // setSizesToElems();

}

// ------------------------------

function createWalls() {
    let key;
    const keysList = Object.keys(config.walls).sort();

    for(let key in config.walls) {
        const params = config.walls[key];
        const isLast = key === keysList[keysList.length - 1];
        const wall = new Wall({
            key: key,
            isLast: isLast
        });
        wallsList.push(wall);

        wallsElem.innerHTML += wall.output;
    }

    wallsElem.classList.add(`walls--${keysList.join('-')}`);

}

export {createWalls, updateSizes};
