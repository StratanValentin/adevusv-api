export function customLog(string: string): void {
    console.log('\x1b[35m%s\x1b[0m', string);
}