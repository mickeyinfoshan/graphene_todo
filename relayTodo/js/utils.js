export function getShowingFromHash() {
    var hash = window.location.hash;
    if(hash.length < 2) {
        return "";
    }
    return hash.substring(2);
}