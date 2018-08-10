export class QuorumPromiseHelper {
  public static execute<T>(promises: Array<Promise<T>>, validatorFn: (result: T) => boolean): Promise<Array<T>> {
    let completed: boolean = false;

    const results: Array<T> = [];

    const total: number = promises.length;

    const quorum: number = Math.floor(total / 2 + 1);

    let successfulCount: number = 0;

    let unsuccessfulCount: number = 0;

    return new Promise<Array<T>>((resolve: (array: Array<T>) => void, reject: (error: Error) => void) => {
      const timeout: number = 200;

      for (const promise of promises) {
        let promiseCompleted: boolean = false;

        setTimeout(() => {
          if (promiseCompleted || completed) {
            return;
          }

          promiseCompleted = true;

          unsuccessfulCount++;

          if (successfulCount >= quorum) {
            completed = true;

            resolve(results);
          }

          if (successfulCount + unsuccessfulCount === total) {
            completed = true;

            resolve(null);
          }
        }, timeout);

        promise
          .then((result: T) => {
            if (promiseCompleted || completed) {
              return;
            }

            promiseCompleted = true;

            if (validatorFn(result)) {
              results.push(result);

              successfulCount++;
            } else {
              unsuccessfulCount++;
            }
          })
          .catch((error: Error) => {
            if (promiseCompleted || completed) {
              return;
            }

            unsuccessfulCount++;
          })
          .then(() => {
            if (completed) {
              return;
            }

            if (successfulCount >= quorum) {
              completed = true;

              resolve(results);
            }

            if (successfulCount + unsuccessfulCount === total) {
              completed = true;

              resolve(null);
            }
          });
      }
    });
  }
}
