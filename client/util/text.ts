export const multiplyText = (text: string, times: number): string => {
    let result = "";
    for (let i = 0; i < times; i++) {
        result += text;
    }
    return result;
};
