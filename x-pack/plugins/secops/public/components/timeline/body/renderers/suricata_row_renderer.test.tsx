/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { mount } from 'enzyme';
import { cloneDeep } from 'lodash/fp';
import * as React from 'react';

import { Ecs } from '../../../../graphql/types';
import { mockEcsData } from '../../../../mock';
import { TestProviders } from '../../../../mock/test_providers';

import { suricataRowRenderer } from '.';

describe('suricata_row_renderer', () => {
  let nonSuricata: Ecs;
  let suricata: Ecs;

  beforeEach(() => {
    nonSuricata = cloneDeep(mockEcsData[0]);
    suricata = cloneDeep(mockEcsData[2]);
  });

  test('should return false if not a suricata datum', () => {
    expect(suricataRowRenderer.isInstance(nonSuricata)).toBe(false);
  });

  test('should return true if it is a suricata datum', () => {
    expect(suricataRowRenderer.isInstance(suricata)).toBe(true);
  });

  test('should render children normally if it does not have a signature', () => {
    const children = suricataRowRenderer.renderRow(nonSuricata, <span>some children</span>);
    const wrapper = mount(
      <TestProviders>
        <span>{children}</span>
      </TestProviders>
    );
    expect(wrapper.text()).toEqual('some children');
  });

  test('should render a suricata row', () => {
    const children = suricataRowRenderer.renderRow(suricata, <span>some children </span>);
    const wrapper = mount(
      <TestProviders>
        <span>{children}</span>
      </TestProviders>
    );
    expect(wrapper.text()).toContain(
      'some children 4ETEXPLOITNETGEARWNR2000v5 hidden_lang_avi Stack Overflow (CVE-2016-10174)Source192.168.0.3:53Destination192.168.0.3:6343'
    );
  });

  test('should render a suricata row even if it does not have a suricata signature', () => {
    delete suricata!.suricata!.eve!.alert!.signature;
    const children = suricataRowRenderer.renderRow(suricata, <span>some children</span>);
    const wrapper = mount(
      <TestProviders>
        <span>{children}</span>
      </TestProviders>
    );
    expect(wrapper.text()).toEqual('some children');
  });
});