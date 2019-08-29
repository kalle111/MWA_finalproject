export function validateLoginInput(userData) {
    for(var key in userData) {
        if (userData[key] === undefined || userData[key]==='' || userData[key]=== NaN || userData[key] === null) {
            console.log('Login input is undefined/NaN/empty/null!');
            return false;
        } else {
            return true;
        }
    }
}