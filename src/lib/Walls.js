import Mustache from 'Mustache';
import {config} from '../data/config';
import {elementStyles} from './elementStyles';

const wallTmpl = document.getElementById('wall-tmpl').innerHTML;
const wallsElem = document.querySelector('.walls');

class Wall {
    constructor(key) {
        const wallConfig = config.walls[key];
        wallConfig.verticalGap = config.verticalGap;

        let view = {
            side: key,
            params: wallConfig,
            lines: [
                {
                    line: 'top',
                    width: wallConfig.top.width
                },
                {
                    line: 'bottom',
                    width: wallConfig.top.width
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

    // ------------------------------

    updateSizes() {
        // setSizes();
        setSizesStyles();
    }
};

// ------------------------------

function createWalls() {
    let key;
    const keysList = Object.keys(config.walls).sort();

    for(let key in config.walls) {
        const params = config.walls[key];
        const wall = new Wall(key);

        // console.log(wall.output);

        wallsElem.innerHTML += wall.output;
    }

    wallsElem.classList.add(`walls--${keysList.join('-')}`);
}

export {createWalls};
