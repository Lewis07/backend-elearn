export const getHourMinuteSecond = (duration: number = null) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    return duration !== null ? `${hours}:${minutes}:${seconds}` : null;
}

export const getHourMinute = (duration: number = null) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    if (hours === 0) {
       return `${minutes} min`;
    }

    if (hours !== 0 && minutes !== 0) {
        return `${hours} h ${minutes} min`
    }

    return duration;
}

export const getMinute = (duration: number = null) => {
    const minutes = Math.floor((duration % 3600) / 60);

    if (minutes !== 0) {
       return `${minutes} min`;
    }

    return duration;
}

export const getMinuteAndSecond = (duration: number = null) => {
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    return duration !== null ? `${minutes}:${seconds}` : null;
}