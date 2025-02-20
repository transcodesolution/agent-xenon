import { calendar_v3 } from "googleapis/build/src/apis/calendar/v3";

export const getDifferenceInDays = (date1: Date, date2: Date) => {
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

export function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getDaysInCurrentMonth = (): number => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const isLeapYear = year % 4 === 0 || year % 400 === 0;

    const monthDays = {
        1: 31,
        2: isLeapYear ? 29 : 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    };

    return monthDays[month];
}

function isConflicting(date: Date, events: Array<calendar_v3.Schema$Event>) {
    const meetingTime = date.getTime();
    const endMeetingTime = new Date(meetingTime + 3600 * 1000).getTime();

    for (const event of events) {
        const eventStart = new Date(event.start.dateTime).getTime();
        const eventEnd = new Date(event.end.dateTime).getTime();
        // 1. Don't schedule exactly at the event's start time
        if (meetingTime === eventStart || endMeetingTime === eventStart) {
            return true;
        }

        // 2. Don't schedule within event duration
        if ((meetingTime > eventStart && meetingTime < eventEnd) || (endMeetingTime > eventStart && endMeetingTime < eventEnd)) {
            return true;
        }

        if (meetingTime === eventEnd || endMeetingTime === eventEnd) {
            return true;
        }
    }

    return false;
}

export function generatePossibleTimeSlots(startISO: string, endISO: string, events: Array<calendar_v3.Schema$Event>) {
    const start = new Date(startISO).getTime();
    const end = new Date(endISO).getTime();

    if (isNaN(start) || isNaN(end) || start >= end) {
        throw new Error("Invalid date range");
    }

    const ISTOffset = 5.5 * 60 * 60 * 1000;
    const currentTime = new Date(start + ISTOffset);

    while (currentTime.getTime() <= end + ISTOffset) {
        const hour = currentTime.getHours();
        const min = [0, 15, 30, 45].find((m) => m >= currentTime.getMinutes()) || 0;

        if (hour >= 9 && hour <= 18) {
            currentTime.setMinutes(min, 0, 0);
            if (!isConflicting(currentTime, events)) {
                return new Date(currentTime);
            }
        }

        currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    return null;
}