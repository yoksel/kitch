import {config} from '../data/config';

let frontOptimalWidth;
let frontDeeps;

setDefaults();

class elementStyles {
    constructor(key) {
        this.key = key;
        this.stylesMap = new Map();
        this.config = config.walls[key];

        this.setSizesToElems();
    }

    // ------------------------------

    setSizesToElems() {
        let deeps = getDeeps(this.config);
        let commonWidth = this.getWidth();
        let commonHeight = this.config.verticalGap + this.config.top.height + this.config.bottom.height;
        let wallTransform = 'none';
        let wallWidth = commonWidth.max;
        const lines = ['top', 'bottom'];

        if (this.key !== 'front') {
            // Add deep to increase wall width
            // and connect corners
            wallWidth += frontDeeps.max;
        }
        else {
            wallWidth = frontOptimalWidth;
        }

        if (this.key === 'left') {
            wallTransform = `translateX(-${deeps.max}px) translateZ(${wallWidth}px) rotateY(90deg)`
        }
        else if (this.key === 'right') {
            wallTransform = `translateX(${deeps.max}px) translateZ(${wallWidth}px) rotateY(-90deg)`
        }

        const wallClass = `.wall--${this.key}`;

        // dirty hack
        // if front wall, set walls & wrapper width
        if (this.key === 'front') {
            this.stylesMap.set('.wrapper', {
                width: frontOptimalWidth,
            });
            this.stylesMap.set('.walls', {
                width: frontOptimalWidth,
                height: commonHeight
            });
            this.stylesMap.set('.floor', {
                width: config.floor.width,
                height: config.floor.deep
            });
        }

        this.stylesMap.set(wallClass, {
            width: wallWidth,
            transform: wallTransform,
        });

        lines.forEach(line => {
            if (this.key !== 'front') {
                const stylesObj = {};
                const paddingSide = this.key === 'left' ? 'right' : 'left';
                stylesObj[`padding-${paddingSide}`] = `${frontDeeps[line]}px`;
                this.stylesMap.set(`${wallClass} .${line}`, stylesObj);
            }

            this.stylesMap.set(`${wallClass} .${line}__block`, {
                height: this.config[line].height,
                transform: `translateZ(${this.config[line].deep}px)`,
            });
            this.stylesMap.set(`${wallClass} .${line}__back`, {
                transform: `translateZ(-${this.config[line].deep}px) rotateY(180deg)`,
            });
            this.stylesMap.set(`${wallClass} .${line}__top`, {
                width: '100%',
                height: this.config[line].deep,
                transform: `translateZ(-${this.config[line].deep}px) rotateX(90deg)`
            });
            this.stylesMap.set(`${wallClass} .${line}__bottom`, {
                width: '100%',
                height: this.config[line].deep,
            });
            this.stylesMap.set(`${wallClass} .${line}__side`, {
                width: this.config[line].deep,
                height: this.config[line].height,
            });

            this.config[line].width.forEach((itemWidth, i)=> {
                const topWidthLength = this.config[line].width.length;
                const selector = `${wallClass} .${line}__block:nth-child(${topWidthLength}n + ${i + 1})`;

                this.stylesMap.set(selector, {
                    width: itemWidth.value,
                    height: this.config[line].height,
                });
            });
        });
    }

    // ------------------------------

    getWidth() {
        let widthSets = [
            this.config.top.width,
            this.config.bottom.width
        ];

        widthSets = widthSets.map(widthSet => {
            if (typeof widthSet === 'object') {
                widthSet = sumArray(widthSet);
            }

            return widthSet;
        });

        return {
            top: widthSets[0],
            bottom: widthSets[1],
            min: Math.min(...widthSets),
            max: Math.max(...widthSets)
        };
    }
}

// ------------------------------

function setDefaults() {
    frontOptimalWidth = getFrontOptimalWidth();

    frontDeeps = getDeeps(config.walls['front']);
}

// ------------------------------

function getDeeps(config) {
    const deepSets = [
        config['top'].deep,
        config['bottom'].deep
    ];

    return {
        top: deepSets[0],
        bottom: deepSets[1],
        min: Math.min(...deepSets),
        max: Math.max(...deepSets)
    };
}

// ------------------------------

function sumArray(arr) {
    return arr.reduce((result, item) => {
        result += item.value;
        return result;
    }, 0);
}

// ------------------------------

function getFrontOptimalWidth() {
    const walls = config.walls;

    let widthSets = [
        sumArray(walls['front'].top.width),
        sumArray(walls['front'].bottom.width),
    ];
    let optimalWidth = Math.max(...widthSets);

    // We have 2 or more sides
    if (Object.keys(walls).length > 1) {
        // Take minimal to connect front with side walls
        optimalWidth = Math.min(...widthSets);
    }

    return optimalWidth;
}

// ------------------------------

export {setDefaults, elementStyles};
