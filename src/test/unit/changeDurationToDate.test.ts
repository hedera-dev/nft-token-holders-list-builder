/*-
 *
 * Hedera Token Holders List
 *
 * Copyright (C) 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { changeDurationToDate } from '@/utils/changeDurationToDate';

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-03-30'));
});

describe('changeDurationToDate', () => {
  it('should subtract days from the current date', () => {
    const result = changeDurationToDate('3', 'days');
    expect(result.getDate()).toEqual(new Date('2024-03-27').getDate());
  });

  it('should subtract weeks from the current date', () => {
    const result = changeDurationToDate('2', 'weeks');
    expect(result.getDate()).toEqual(new Date('2024-03-16').getDate());
  });

  it('should subtract months from the current date', () => {
    const result = changeDurationToDate('1', 'months');
    expect(result.getDate()).toEqual(new Date('2024-02-29').getDate());
  });

  it('should return the same date if a Date object is passed', () => {
    const date = new Date();
    const result = changeDurationToDate(date, 'days');
    expect(result).toEqual(date);
  });
});
