export function animateNumber(start, end, duration, callback) {
    const startTime = Date.now();
    const range = end - start;

    const timer = setInterval(() => {
        const progress = Math.min(
            (Date.now() - startTime) / duration,
            1
        );

        callback(Math.floor(start + range * progress));

        if (progress === 1) clearInterval(timer);
    }, 16);
}