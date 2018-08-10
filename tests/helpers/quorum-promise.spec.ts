import { expect } from 'chai';
import { QuorumPromiseHelper } from '../../src/helpers/quorum-promise';

describe('QuorumPromiseHelper', () => {
  describe('#execute', () => {
    it('Should return array of 3 items given 4 successful items', async () => {
      const result: Array<boolean> = await QuorumPromiseHelper.execute(
        buildPromises([true, true, true, true]),
        (result: boolean) => {
          return result;
        },
      );

      expect(result.length).to.be.eq(3);
    });

    it('Should return array of 3 items given 3 successful items and 1 uncompleted items', async () => {
        const result: Array<boolean> = await QuorumPromiseHelper.execute(
          buildPromises([true, true, true, undefined]),
          (result: boolean) => {
            return result;
          },
        );
  
        expect(result.length).to.be.eq(3);
      });

    it('Should return null given 2 successful items and 2 unsuccessful items', async () => {
      const result: Array<boolean> = await QuorumPromiseHelper.execute(
        buildPromises([true, true, false, false]),
        (result: boolean) => {
          return result;
        },
      );

      expect(result).to.be.null;
    });

    it('Should return null given 2 successful items and 2 failed items', async () => {
      const result: Array<boolean> = await QuorumPromiseHelper.execute(
        buildPromises([true, true, null, null]),
        (result: boolean) => {
          return result;
        },
      );

      expect(result).to.be.null;
    });

    it('Should return null given 2 successful items and 2 uncompleted items', async () => {
      const result: Array<boolean> = await QuorumPromiseHelper.execute(
        buildPromises([true, true, undefined, undefined]),
        (result: boolean) => {
          return result;
        },
      );

      expect(result).to.be.null;
    });
  });
});

function buildPromises(results: Array<boolean>): Array<Promise<boolean>> {
  const promises: Array<Promise<boolean>> = [];

  for (let index = 0; index < results.length; index++) {
    const result: boolean = results[index];
    promises.push(
      new Promise<boolean>((resolve: (result: boolean) => void, reject: (error: Error) => void) => {
        setTimeout(() => {
          if (result === undefined) {
            return;
          }

          if (result === null) {
            reject(new Error());

            return;
          }

          resolve(result);
        }, (index + 1) * 2);
      }),
    );
  }

  return promises;
}
