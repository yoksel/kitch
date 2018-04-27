import {config} from '../data/config';

const frontOptimalWidth = getFrontOptimalWidth();
const frontDeeps = getDeeps([
    config.walls['front'].top.deep,
    config.walls['front'].bottom.deep
]);

class elementStyles {
    constructor(key) {
        this.key = key;
        this.stylesMap = new Map();
        this.config = config.walls[key];

        this.setSizesToElems();
    }

    // ------------------------------

    setSizesToElems() {
        const deepsList = [
            this.config.top.deep,
            this.config.bottom.deep
        ];
        let deeps = getDeeps(deepsList);
        let commonWidth = this.getWidth();
        let commonHeight = this.config.verticalGap + this.config.top.height + this.config.bottom.height;
        let wallTransform = 'none';
        let wallWidth = commonWidth.max;
        const lines = ['top', 'bottom'];


        if (this.key !== 'front') {
            // Add deep to increase wall width
            // and connect corners
            wallWidth += frontDeeps.min;
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
        }

        this.stylesMap.set(wallClass, {
            width: wallWidth,
            transform: wallTransform,
        });

        lines.forEach(line => {
            this.stylesMap.set(`${wallClass} .${line}__block`, {
                width: commonWidth[line],
                height: this.config[line].height,
                transform: `translateZ(${this.config[line].deep}px)`,
            });
            this.stylesMap.set(`${wallClass} .${line}__top`, {
                width: commonWidth[line],
                height: this.config[line].deep,
            });
            this.stylesMap.set(`${wallClass} .${line}__bottom`, {
                width: commonWidth[line],
                height: this.config[line].deep,
            });
            this.stylesMap.set(`${wallClass} .${line}__side`, {
                width: this.config[line].deep,
                height: this.config[line].height,
            });

            this.config[line].width.forEach((itemWidth, i)=> {
                const topWidthLength = this.config[line].width.length;
                const selector = `${wallClass} .${line}__front:nth-child(${topWidthLength}n + ${i + 1})`;

                this.stylesMap.set(selector, {
                    width: itemWidth,
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

function getDeeps(deepSets) {
    return {
        min: Math.min(...deepSets),
        max: Math.max(...deepSets)
    };
}

// ------------------------------

function sumArray(arr) {
    return arr.reduce((result, item) => {
        result += item;
        return result;
    }, 0);
}

// ------------------------------

function getFrontOptimalWidth() {
    let optimalWidth;
    const walls = config.walls;
    let widthSets = [
        sumArray(walls['front'].top.width),
        sumArray(walls['front'].bottom.width),
    ];

    // We have 2 or more sides
    if (Object.keys(walls).length > 1) {
        // Take minimal to connect front with side walls
        optimalWidth = Math.min(...widthSets);
    }
    else {
        // Take max to show full wall
        optimalWidth = Math.max(...widthSets);
    }

    console.log('widthSets', widthSets);
    console.log('optimalWidth', optimalWidth);

    // console.log(walls);
    return optimalWidth;
}

// ------------------------------

export {elementStyles};