module.exports =

function getFirstString(json) {
    // Helper function to recursively search for the first string
    function search(data) {
        if (typeof data === 'string') {
            return data; // Return if the data is a string
        }
        if (Array.isArray(data)) {
            for (const item of data) {
                const result = search(item);
                if (result) return result; // Return the first string found in the array
            }
        } else if (typeof data === 'object' && data !== null) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const result = search(data[key]);
                    if (result) return result; // Return the first string found in the object
                }
            }
        }
        return null; // Return null if no string is found
    }

    return search(json);
}