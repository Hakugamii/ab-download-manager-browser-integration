const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-\.]+)(?:; ?|$)/i;
const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i;

export function getFileNameFromHeader(disposition: string): string | null {
    //utf8 check
    const utf8CheckResult = utf8FilenameRegex.exec(disposition)
    if (utf8CheckResult !== null && utf8CheckResult[1]) {
        return decodeURIComponent(utf8CheckResult[1]);
    }
    // ascii check
    // prevent ReDos attacks by anchoring the ascii regex to string start and
    //  slicing off everything before 'filename='
    const filenameStart = disposition.toLowerCase().indexOf('filename=');
    if (filenameStart >= 0) {
        const partialDisposition = disposition.slice(filenameStart);
        const asciiCheckResult = asciiFilenameRegex.exec(partialDisposition);
        if (asciiCheckResult != null && asciiCheckResult[2]) {
            return decodeURIComponent(asciiCheckResult[2]);
        }
    }
    return null;
}