const myHeaders = new Headers({
    'Host': 'api.content.market.yandex.ru',
    'Accept': '*/*',
    'Authorization': 'zVRVahvpz1tdnZ7uPmcQ8SDZXU1KSn',
});

const options = {
    headers: myHeaders,
    method: 'GET',
    cache: 'default',
    credentials: 'include'
};

class RequestUrl {

    constructor() {
        this.queriesList = [];
        this.hasPromise = false;
    }

    get(url, onResolve, onReject) {
        // Сохраняем полученные аргументы
        this.queriesList.push(arguments);

        // Если первого промиса не было, создаём
        if (!this.hasPromise) {
            this.hasPromise = true;
            this.createPromise();
        }

        return this;
    }

    createPromise(prevResponse = null) {
        if (this.queriesList.length > 0) {
            // Берём первый пункт из списка запросов и создаём промис
            const nextQueryParams = this.queriesList.splice(0,1)[0];
            this.handleRequest(prevResponse, ...nextQueryParams);
        }
    }

    handleRequest(prevResponse, url, onResolve, onReject) {
        var myRequest = new Request(url, options);

        fetch(myRequest)
            .then(response => {
                console.log('=== response ===');
                console.log(response);
                onResolve(response, prevResponse);
                this.createPromise(response);
            })
            .catch((error) => {
                console.log('=== Error ===');
                console.log(error);
                onReject(error, url, prevResponse);
                this.createPromise();
            });
    }
}

export {RequestUrl};
