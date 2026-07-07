export class Logger {
  private static formatTimestamp(): string {
    return new Date().toISOString();
  }

  private static log(level: 'START' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO', message: string, meta?: any) {
    const timestamp = this.formatTimestamp();
    const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
    console.log(`[${timestamp}] [${level}] ${message}${metaString}`);
  }

  public static info(message: string, meta?: any) {
    this.log('INFO', message, meta);
  }

  public static start(message: string, meta?: any) {
    this.log('START', message, meta);
  }

  public static success(message: string, meta?: any) {
    this.log('SUCCESS', message, meta);
  }

  public static warn(message: string, meta?: any) {
    this.log('WARNING', message, meta);
  }

  public static error(message: string, error?: any) {
    let errorMessage = message;
    let meta: any = undefined;

    if (error) {
      if (error instanceof Error) {
        errorMessage = `${message} - Error: ${error.message}`;
        meta = { stack: error.stack };
      } else {
        meta = { error };
      }
    }
    this.log('ERROR', errorMessage, meta);
  }
}
