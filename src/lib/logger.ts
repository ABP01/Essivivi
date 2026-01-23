/**
 * Logger utility for the frontend.
 * Wraps console methods to allow for environment-based filtering and better formatting.
 */

const isProduction = process.env.NODE_ENV === 'production';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
    private prefix: string;

    constructor(prefix: string = '') {
        this.prefix = prefix ? `[${prefix}] ` : '';
    }

    private formatMessage(message: any): any[] {
        if (typeof message === 'string') {
            return [`${this.prefix}${message}`];
        }
        return [this.prefix, message];
    }

    debug(...args: any[]) {
        if (!isProduction) {
            console.log(...this.formatMessage(args[0]), ...args.slice(1));
        }
    }

    info(...args: any[]) {
        // In production, we might want to silence info logs or send them to a service
        if (!isProduction) {
            console.info(...this.formatMessage(args[0]), ...args.slice(1));
        }
    }

    warn(...args: any[]) {
        console.warn(...this.formatMessage(args[0]), ...args.slice(1));
    }

    error(...args: any[]) {
        console.error(...this.formatMessage(args[0]), ...args.slice(1));
    }
}

export const logger = new Logger();

export const createLogger = (prefix: string) => new Logger(prefix);
