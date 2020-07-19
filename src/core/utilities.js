export function formatCurrency(number, decimalLength, sectionLength) {
    let re = '\\d(?=(\\d{' + (sectionLength || 3) + '})+' + (decimalLength > 0 ? '\\.' : '$') + ')';
    return number.toFixed(Math.max(0, ~~decimalLength)).replace(new RegExp(re, 'g'), '$&,');
}

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('/');
}

export function formatDateTime(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        minute = d.getMinutes();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (hour < 10)
        hour = '0' + hour;
    if (minute < 10)
        minute = '0' + minute;

    return [day, month, year].join('/') + ` ${hour}:${minute}`;
}

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function getMonths() {
    const currentMonth = new Date().getMonth() + 1;

    if (currentMonth == 1)
        return [11, 12, 1];

    if (currentMonth == 2)
        return [12, 1, 2];

    return [currentMonth - 2, currentMonth - 1, currentMonth];
}

export function simpleHash(text) {
    var hash = 0, i, chr;
    for (i = 0; i < text.length; i++) {
      chr = text.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function getMonthsWithQuarter(quarter) {
    if (quarter === 1)
        return [1, 2, 3];

    if (quarter === 2)
        return [4, 5, 6];

    if (quarter === 3)
        return [7, 8, 9];

    return [10, 11, 12];
}