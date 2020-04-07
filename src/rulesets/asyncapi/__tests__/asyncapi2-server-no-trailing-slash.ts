import { cloneDeep } from 'lodash';

import { buildTestSpectralWithAsyncApiRule } from '../../../../setupTests';
import { Spectral } from '../../../spectral';
import { IRunRule } from '../../../types';

const ruleName = 'asyncapi2-server-no-trailing-slash';
let s: Spectral;
let rule: IRunRule;

describe(`Rule '${ruleName}'`, () => {
  beforeEach(async () => {
    [s, rule] = await buildTestSpectralWithAsyncApiRule(ruleName);
  });

  const doc = {
    asyncapi: '2.0.0',
    servers: {
      production: {
        url: 'stoplight.io',
        protocol: 'https',
      },
    },
  };

  test('validates a correct object', async () => {
    const results = await s.run(doc, { ignoreUnknownFormat: false });

    expect(results).toEqual([]);
  });

  test('return result if {server}.url property ends with a trailing slash', async () => {
    const clone = cloneDeep(doc);

    clone.servers.production.url = 'stoplight.io/';

    const results = await s.run(clone, { ignoreUnknownFormat: false });

    expect(results).toEqual([
      expect.objectContaining({
        code: ruleName,
        message: 'Server URL should not end with a slash.',
        path: ['servers', 'production', 'url'],
        severity: rule.severity,
      }),
    ]);
  });
});
