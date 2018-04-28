import Mustache from 'Mustache';
import {config} from '../data/config';
import {setDefaults, ElementStyles} from './ElementStyles';

const wallTmpl = document.getElementById('wall-tmpl').innerHTML;
const wallsElem = document.querySelector('.walls');
let wallsList = [];

class Wall {
    constructor(params) {
        const key = params.key;
        this.params = params;
        this.wallConfig = config.walls[key];
        this.wallConfig.verticalGap = config.verticalGap;

        let view = {
            side: key,
            params: this.wallConfig,
            lines: [
                {
                    line: 'top',
                    blocks: this.extendBlocks('top')
                },
                {
                    line: 'bottom',
                    blocks: this.extendBlocks('bottom')
                },
            ]
        };

        this.elementStyles = new ElementStyles(key);
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

    // ------------------------------

    extendBlocks(key) {
        const isLastWall = this.params.isLast;
        let blocks = this.wallConfig[key].width;

        blocks = blocks.map((block, i) => {
            block.pos = i;
            block.posInRow = [];
            const isLast = i === blocks.length - 1;
            const isFirst = i === 0;
            let prevBlock = blocks[i - 1];
            let isPrevIsEmpty = prevBlock && prevBlock.isEmpty;
            let nextBlock = blocks[i + 1];
            let isNextIsEmpty = nextBlock && nextBlock.isEmpty;
            block.height = (isLastWall && isLast) ? this.wallConfig[key].height : '';

            if (isLast || isNextIsEmpty) {
                block.posInRow.push('last');
            }

            if (isFirst || isPrevIsEmpty) {
                block.posInRow.push('first');
            }

            return block;
        });

        return blocks;
    }

};

// ------------------------------

function updateSizes() {
    setDefaults();

    wallsList.forEach(wall => {
        wall.elementStyles.setSizesToElems();
        wall.setSizesStyles();
    });
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
