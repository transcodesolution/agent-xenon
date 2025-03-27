export function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomNumberForUniqueId(min = 1000000, max = 9000000) {
    return Math.floor(min + Math.random() * max);
}