export const assertEnv = (variables: string[]): void => {
  variables.forEach((name) => {
    if (!process.env[name]) {
      const message = `Missing environment variable: ${name}`
      if (process.env.NODE_ENV === 'production') {
        throw new Error(message)
      } else {
        console.warn(message)
      }
    }
  })
}
