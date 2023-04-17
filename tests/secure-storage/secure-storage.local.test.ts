/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LocalSecureStorage } from 'lib/secure-storage/secure-storage.local';
import { encrypt } from 'utils/cipher';

const MOCK_KEY = 'mock';
const MOCK_VALUE = { mock: 'mock' };
const MOCK_ENCRYPTED_VALUE = encrypt(JSON.stringify(MOCK_VALUE));
const MOCK_STORED_DATA = { [`${MOCK_KEY}`]: MOCK_ENCRYPTED_VALUE };

const mockGet = jest.fn();
const mockSet = jest.fn();
const mockDelete = jest.fn();

jest.mock('../../lib/utils/local-db', () => ({
  initDb() {
    return {
      get: mockGet,
      set: mockSet,
      delete: mockDelete,
    };
  },
}));

describe('LocalSecureStorage', () => {
  let localSecureStorage: LocalSecureStorage;

  beforeEach(() => {
    localSecureStorage = new LocalSecureStorage();
  });

  describe('set', () => {
    it('should fail for undefined value', async () => {
      // @ts-ignore
      await expect(localSecureStorage.set(MOCK_KEY, undefined)).rejects.toThrow();
    });

    it('should fail for value which is not an object', async () => {
      // @ts-ignore
      await expect(localSecureStorage.set(MOCK_KEY, 'not an object')).rejects.toThrow();
    });

    it('should fail for undefined key', async () => {
      // @ts-ignore
      await expect(localSecureStorage.set(undefined, MOCK_VALUE)).rejects.toThrow();
    });

    it('should set data when all is valid', async () => {
      await localSecureStorage.set(MOCK_KEY, MOCK_VALUE);
      expect(mockSet).toBeCalled();
    });
  });

  describe('get', () => {
    it('should fail for undefined key', async () => {
      // @ts-ignore
      await expect(localSecureStorage.get(undefined)).rejects.toThrow();
    });

    it('should fail for key without value', async () => {
      const badKey = 'badKey';
      await expect(localSecureStorage.get(badKey)).rejects.toThrow();
    });

    it('should succeed for key with value', async () => {
      mockGet.mockImplementation(() => MOCK_STORED_DATA[MOCK_KEY]);
      const result = await localSecureStorage.get(MOCK_KEY);
      expect(result).toEqual(MOCK_VALUE);
    });
  });

  describe('delete', () => {
    it('should fail for undefined key', async () => {
      // @ts-ignore
      await expect(localSecureStorage.delete(undefined)).rejects.toThrow();
    });

    it('should delete for valid key', async () => {
      const mockKeyToDelete = 'deleteMe';
      await localSecureStorage.delete(mockKeyToDelete);
      expect(mockDelete).toBeCalledWith(mockKeyToDelete);
    });

    it('should not fail for multiple deletions of the same key', async () => {
      const mockKeyToDelete = 'deleteMe';
      await localSecureStorage.delete(mockKeyToDelete);
      await expect(localSecureStorage.delete(mockKeyToDelete)).resolves.toBeTruthy();
    });
  });
});