export const getDifferenceInDays = (date1, date2) => {
    const differenceInTime = date1.getTime() - date2.getTime();
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
    return differenceInDays;
}

export const getDateAfterDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

export const convertISTHoursToUTCDate = (istTime: string): Date => {  // 11:00 to UTC date formate
    const [hours, minutes] = istTime.split(':').map(Number);
    const utcDate = new Date();
    utcDate.setHours(hours, minutes, 0, 0);
    console.log(utcDate)
    return utcDate;
}

export const convertISTToUTC = (date: Date): Date => {
    const utcData = new Date(date);
    utcData.setHours(utcData.getHours() - 5);
    utcData.setMinutes(utcData.getMinutes() - 30);
    return utcData;
}