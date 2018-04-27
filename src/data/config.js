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
                        value: 60
                    },
                    {
                        value: 150
                    },
                    {
                        value: 110,
                        isEmpty: true
                    },
                    {
                        value: 65
                    }
                ],
                height: 60,
                deep: 40
            },
            bottom: {
                width: [
                    {
                        value: 60
                    },
                    {
                        value: 50
                    },
                    {
                        value: 110
                    },
                    {
                        value: 45
                    }
                ],
                height: 100,
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
                        value: 50
                    },
                    {
                        value: 65
                    },
                    {
                        value: 40
                    }
                ],
                height: 60,
                deep: 40
            },
            bottom: {
                width: [
                    {
                        value: 60
                    },
                    {
                        value: 50
                    },
                    {
                        value: 45
                    },
                    {
                        value: 40
                    }
                ],
                height: 100,
                deep: 60
            },
        },
        right: {
            top: {
                width: [
                    {
                        value: 150
                    },
                    {
                        value: 45
                    }
                ],
                height: 60,
                deep: 40
            },
            bottom: {
                width: [
                    {
                        value: 150
                    },
                    {
                        value: 45
                    }
                ],
                height: 100,
                deep: 60
            },
        }
    },
    verticalGap: 50
}

export {config};
