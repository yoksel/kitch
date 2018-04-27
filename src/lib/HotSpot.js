import {goods} from '../data/goods';
import Mustache from 'Mustache';

const images = require.context('../img/', true);

const tmpl = document.getElementById('card-tmpl').innerHTML;

const goodsElem = document.querySelector('.goods');
const goodsClasses = {
    list: 'goods__list',
    item: 'goods__item'
};

class HotSpot {
    constructor(elem) {
        this.elem = elem;

        this.elem.addEventListener('click', () => {
            this.showGoods();
        });

        return this.elem;
    }

    // ------------------------------

    showGoods() {
        const width = parseInt(this.elem.style.width, 10);
        const filtered = this.filterByWidth(width);
        // console.log(width);
        // console.log(filtered);
        var view = {
            cards: filtered
        };

        var output = Mustache.render(tmpl, view);
        goodsElem.innerHTML = output;
        // console.log(output);

        // console.log(goods);
    }

    // ------------------------------

    filterByWidth(width){
        let filtered = goods.filter(item => {
            if (item.sizes.width <= width) {
                return true;
            }
        });

        filtered = filtered.map(item => {
            if(!item.imgPath) {
                item.imgPath = `img/${item.img}.jpg`;
            }
            if(!item.sizesStr) {
                // console.log(item.sizes);
                item.sizesStr = Object.values(item.sizes).join('x');
            }
            return item;
        });

        return filtered;
    }

}

export {HotSpot};
