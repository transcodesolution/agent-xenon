import redisConnection from "../helper/redis";

export const setValue = (key: string, value: string | number) => {
    redisConnection.set(key, JSON.stringify(value));
}

export const getValue = async (key: string) => {
    const value = await redisConnection.get(key);
    return +value || 0;
}