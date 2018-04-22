var ghpages = require('gh-pages');

function publish() {
    ghpages.publish('dist', function (err) {
        if (err) {
            console.log('Error: ', err);
        }
    });
    console.log(' Folder `dist/` was published to gh-pages');
}

module.exports = publish();
