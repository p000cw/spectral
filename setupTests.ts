import { RulesetExceptionCollection } from './src/types/ruleset';

import { Dictionary } from '@stoplight/types';
import { IRunRule, isAsyncApiv2, Rule, Spectral } from './src';
import { readRuleset } from './src/rulesets';
import { asyncApiRules } from './src/rulesets/asyncapi/index.json';

export const buildRulesetExceptionCollectionFrom = (
  loc: string,
  rules: string[] = ['a'],
): RulesetExceptionCollection => {
  const source = {};
  source[loc] = rules;
  return source;
};

export const buildTestSpectralWithAsyncApiRule = async (ruleName: string): Promise<[Spectral, IRunRule]> => {
  const ruleset = await readRuleset('spectral:asyncapi');

  expect(Object.keys(ruleset.rules)).toContain(ruleName);

  const s = new Spectral();
  s.registerFormat('asyncapi2', isAsyncApiv2);

  const dic: Dictionary<Rule, string> = {};
  const rule1 = ruleset.rules[ruleName];

  const x = asyncApiRules[ruleName];
  const r: Rule = Object.assign(rule1, {
    recommended: true,
    severity: x.severity,
  });

  dic[ruleName] = r;
  s.setRules(dic);

  expect(Object.keys(s.rules)).toEqual([ruleName]);

  const rule = s.rules[ruleName];
  expect(rule.recommended).not.toBe(false);
  expect(rule.severity).not.toBeUndefined();
  expect(rule.severity).not.toEqual(-1);

  return [s, rule];
};
