export const getMemoryUsage = () => {
    const memoryUsage = process.memoryUsage();
    console.log(`Heap Used memoryUsage:`, memoryUsage);

    const totalMemory = memoryUsage.rss + memoryUsage.heapTotal + memoryUsage.external + memoryUsage.heapUsed + memoryUsage.arrayBuffers;
    // console.log(`totalMemory:`, totalMemory);

    console.log(`Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB`);
    console.log(`Total Memory: ${totalMemory / 1024 / 1024} MB`);
}