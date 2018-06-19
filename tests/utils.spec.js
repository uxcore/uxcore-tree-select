import { flatToHierarchy, filterCheckedKeysBaseKey } from '../src/utils';
import React from 'react';
import Enzyme from 'enzyme';
import expect from 'expect.js';
import TreeSelect from '../src';
import Adapter from 'enzyme-adapter-react-16';
// import focusTest from './shared/focusTest';

const { mount, render } = Enzyme;

Enzyme.configure({ adapter: new Adapter() });

describe('Utils', () => {
  describe('flatToHierarchy', () => {
    const array = [
      {
        value: '0-0',
        pos: '0-0',
      },
      {
        value: '0',
        pos: '0',
        children: [
          {
            value: '0-0',
            pos: '0-0',
          },
        ],
      },
    ];
    const array2 = [
      {
        value: '0-0',
        pos: '0-0',
        isAll: true,
      },
      {
        value: '0',
        pos: '0',
        isAll: true,
        children: [
          {
            value: '0-0',
            pos: '0-0',
          },
        ],
      },
    ];
    const array3 = [...array2];
    it('test equal array to tree with flag=false', () => {
      expect(JSON.stringify(flatToHierarchy(array))).to.equal(JSON.stringify([
        {
          value: '0',
          pos: '0',
          children: [
            {
              value: '0-0',
              pos: '0-0',
            },
            {
              value: '0-0',
              pos: '0-0',
            },
          ],
        },
      ]));
    });

    it('test equal array to tree with flag=true', () => {
      expect(JSON.stringify(flatToHierarchy(array2, true))).to.equal(JSON.stringify([
        {
          value: '0',
          pos: '0',
          isAll: true,
          children: [
            {
              value: '0-0',
              pos: '0-0',
            },
          ],
        },
      ]));
    });

    it('test equal array with isAll to tree with flag=false', () => {
      expect(JSON.stringify(flatToHierarchy(array3))).to.equal(JSON.stringify([
        {
          value: '0',
          pos: '0',
          isAll: true,
          children: [
            {
              value: '0-0',
              pos: '0-0',
            },
            {
              value: '0-0',
              pos: '0-0',
              isAll: true,
            },
          ],
        },
      ]));
    });
  });
});
