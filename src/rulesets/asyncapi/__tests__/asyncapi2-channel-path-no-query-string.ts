import { cloneDeep } from 'lodash';

import { buildTestSpectralWithAsyncApiRule } from '../../../../setupTests';
import { Spectral } from '../../../spectral';
import { IRunRule } from '../../../types';

const ruleName = 'asyncapi2-channel-path-no-query-string';
let s: Spectral;
let rule: IRunRule;

describe(`Rule '${ruleName}'`, () => {
  beforeEach(async () => {
    [s, rule] = await buildTestSpectralWithAsyncApiRule(ruleName);
  });

  const doc = {
    asyncapi: '2.0.0',
    channels: {
      'users/{userId}/signedUp': {},
    },
  };

  test('validates a correct object', async () => {
    const results = await s.run(doc, { ignoreUnknownFormat: false });

    expect(results).toEqual([]);
  });

  test('return result if channels.{channel} ends contains a query string', async () => {
    const clone = cloneDeep(doc);

    clone.channels['users/{userId}/signedOut?byMistake={didFatFingerTheSignOutButton}'] = {};

    const results = await s.run(clone, { ignoreUnknownFormat: false });

    expect(results).toEqual([
      expect.objectContaining({
        code: ruleName,
        message: 'Channel path should not include a query string.',
        path: ['channels', 'users/{userId}/signedOut?byMistake={didFatFingerTheSignOutButton}'],
        severity: rule.severity,
      }),
    ]);
  });
});
