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

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function getMonths() {
    const currentMonth = new Date().getMonth();
    if (currentMonth < 4)
        return [1, 2, 3];

    if (currentMonth < 7)
        return [4, 5, 6];

    if (currentMonth < 10)
        return [7, 8, 9];

    return [10, 11, 12];
}