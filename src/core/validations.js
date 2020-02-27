const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/** Minimum eight characters, at least one letter and one number */
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

/**
 * Validate username.
 * @param {string} username 
 */
export function validateUsername(username) {
    // TODO: check exist usernames.
    return username && emailRegex.test(username);
}

/**
 * Validate password.
 * @param {string} password 
 */
export function validatePassword(password) { 
    return password && passwordRegex.test(password);
}

/**
 * Validate VN phone number.
 * @param {string} number 
 */
export function validatePhoneNumber(number) {
    return number && number.startsWith("0") && number.length === 10;
}