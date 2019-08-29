export function datetimeToString(datetime) {
    if(typeof datetime === 'string' ) {
        var t = datetime.replace("T", " ").split(/[- :]/);
        // Split timestamp into [ Y, M, D, h, m, s ]
        //var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
        var dateString = (t[2]+"."+t[1]+"."+t[0]);
        return dateString.toString();
    } else {
        return "-";
    }
    
}

export function replaceAll(string, toReplace) {
    let temp = [];
    for(var i = 0; i<string.length; i++) {
        if(string.charAt(i) === ' ') {
            // skip
        } else {
            temp.push(string.charAt(i));
        }
    }
    return temp.join("");
}