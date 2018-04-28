import {config} from '../data/config';

let allDeeps = {};
let allWidths = {};
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
        let commonWidth = getWidths(this.config);
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
            wallTransform = `translateZ(${wallWidth}px) rotateY(90deg)`
        }
        else if (this.key === 'right') {
            wallTransform = `translateZ(${wallWidth}px) rotateY(-90deg)`
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
                // Bind offset from the wall to front boxes deep
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
}

// ------------------------------

function setDefaults() {
    Object.keys(config.walls).forEach(wallKey => {
        allDeeps[wallKey] = getDeeps(config.walls[wallKey]);
        allWidths[wallKey] = getWidths(config.walls[wallKey]);
    });

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

function getWidths(config) {
    let widthSets = [
        config.top.width,
        config.bottom.width
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
    // Take all walls deeps except front
    const allDeepsKeys = Object.keys(allDeeps)
        .filter(key => key !== 'front');
    let minFrontWidth = allWidths['front'].min;

    let widthSets = {
        top: allWidths['front'].top,
        bottom: allWidths['front'].bottom
    };

    // If sides exist
    if (allDeepsKeys.length > 0) {
        allDeepsKeys.forEach(deepKey => {
            // Add side deep to front max width
            widthSets.top += allDeeps[deepKey].top;
            widthSets.bottom += allDeeps[deepKey].bottom;
        });
    }
    let optimalWidth = Math.max(...Object.values(widthSets));

    return optimalWidth;
}

// ------------------------------

export {setDefaults, elementStyles};
