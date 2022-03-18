import 'dotenv/config';

class EnvironmentVariables {
  private env: { [k: string]: string | undefined };
  constructor(env: NodeJS.ProcessEnv) {
    this.env = env;
  }

  /**
   * 
   * @param key env key to be gotten
   * @param throwOnMissing indicates whether to throw an error if env value isnt found
   * @returns corresponding environmental variable value of key provided
   */
  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key] || '';
    if (!value && throwOnMissing) {
      throw new Error(
        `\tmissing env.${key} in .env file\n`
      );
    }
    return value;
  }
}

export default new EnvironmentVariables(process.env);
