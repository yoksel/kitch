const config = {
    floor: {
        width: 500,
        deep: 400
    },
    walls: {
        front: {
            top: {
                width: [
                    {
                        value: 80
                    },
                    {
                        value: 150
                    },
                    {
                        value: 110,
                        isEmpty: true
                    },
                    {
                        value: 80
                    }
                ],
                deep: 40
            },
            bottom: {
                width: [
                    {
                        value: 60
                    },
                    {
                        value: 150
                    },
                    {
                        value: 110
                    },
                    {
                        value: 60
                    }
                ],
                deep: 60
            },
        },
        left: {
            top: {
                width: [
                    {
                        value: 60
                    },
                    {
                        value: 60
                    },
                    {
                        value: 100
                    }
                ],
                deep: 40
            },
            bottom: {
                width: [
                    {
                        value: 60
                    },
                    {
                        value: 60
                    },
                    {
                        value: 100
                    }
                ],
                deep: 60
            },
        },
        right: {
            top: {
                width: [
                    {
                        value: 80
                    },
                    {
                        value: 60
                    }
                ],
                deep: 40
            },
            bottom: {
                width: [
                    {
                        value: 60
                    },
                    {
                        value: 60
                    }
                ],
                deep: 60
            },
        }
    },
    height: {
        top: 60,
        bottom: 120
    },
    verticalGap: 50
}

export {config};
