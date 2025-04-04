export function paginateArray(data: Array<object | string | number>, page: number, limit: number) {
    // Calculate the starting index based on the page and limit
    const skip = (page - 1) * limit;

    // Use slice to apply skip and limit
    return data.slice(skip, skip + limit);
}