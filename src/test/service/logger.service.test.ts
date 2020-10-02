import { MockLib } from './../mock.lib';
import { LoggerService } from '../../service/logger.service';
import * as winston from 'winston';
import { Logger } from 'winston';

describe('Test LoggerService', () => {
  const message = `testing message`;
  let testingInfoFn;
  let testingErrorFn;
  beforeEach(() => {
    testingInfoFn = jest.fn();
    testingErrorFn = jest.fn();
    jest.spyOn(winston, 'createLogger').mockReturnValueOnce({
      info: (msg) => {
        expect(msg).toBe(message);
        testingInfoFn();
      },

      error: (msg) => {
        expect(msg).toBe(message);
        testingErrorFn();
      }
    } as Logger);
  });

  afterEach(() => {
    MockLib.restoreAllMocks();
  });

  test('Test info', () => {
    LoggerService.getInstance().info(message);
    expect(testingInfoFn).toBeCalledTimes(1);
    expect(testingErrorFn).toBeCalledTimes(0);
  });

  test('Test error', () => {
    LoggerService.getInstance().error(message);
    expect(testingInfoFn).toBeCalledTimes(0);
    expect(testingErrorFn).toBeCalledTimes(1);
  });
});
