export const validateEmail = (email: string) => {
    const emailRegex = /^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/;

    return emailRegex.test(email);
};