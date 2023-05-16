

import { removeEmptyValues } from './removeEmptyValues';

describe('removeEmptyValues', () => {
  it('should remove empty values from an object', () => {
    const input = {
      a: 1,
      b: '',
      c: null,
      d: undefined,
      e: 0,
    };
    const expected = {
      a: 1,
      e: 0,
    };
    expect(removeEmptyValues(input)).toEqual(expected);
  });
});