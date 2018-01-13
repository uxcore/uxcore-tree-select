/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import Enzyme from 'enzyme';
import TreeSelect, { SHOW_PARENT, SHOW_ALL } from '../src';
import Adapter from 'enzyme-adapter-react-15';
import options from './const';

const { mount, render } = Enzyme;

Enzyme.configure({ adapter: new Adapter() });

describe('TreeSelect.checkable', () => {
  it('can be single checked', () => {
    const wrapper = mount(<TreeSelect
      treeData={[
        { label: 'test1', value: '1' },
        { label: 'test2', value: '2' },
        { label: 'test3', value: '3' },
      ]}
      treeCheckable
      allowClear
      showCheckedStrategy={SHOW_PARENT}
      open
    />);
    // select
    const trigger = mount(wrapper.find('Trigger').props().popup);
    trigger.find('.uxcore-tree-select-tree-checkbox').last().simulate('click');
    wrapper.update();
    expect(wrapper.find('.uxcore-tree-select-selection__choice')).to.have.length(1);
  });

  it('can be multiple checked', () => {
    const wrapper = mount(<TreeSelect
      treeData={[
        { label: 'test1', value: '1' },
        { label: 'test2', value: '2' },
        { label: 'test3', value: '3' },
      ]}
      treeCheckable
      allowClear
      showCheckedStrategy={SHOW_ALL}
      open
    />);
    // select
    const trigger = mount(wrapper.find('Trigger').props().popup);
    trigger.find('.uxcore-tree-select-tree-checkbox').first().simulate('click');
    trigger.find('.uxcore-tree-select-tree-checkbox').at(1).simulate('click');
    wrapper.update();
    expect(wrapper.find('.uxcore-tree-select-selection__choice')).to.have.length(2);
  });

  it('can be controled by inputValue', () => {
    const wrapper = mount(<TreeSelect
      treeData={[
        { label: 'test1', value: '1' },
        { label: 'test2', value: '2' },
        { label: 'test3', value: '3' },
      ]}
      treeCheckable
      allowClear
      showCheckedStrategy={SHOW_PARENT}
      open
    />);
    wrapper.find('input').simulate('change', { target: { value: '3' } });
    // expect(trigger.find('.uxcore-tree-select-tree-checkbox')).to.have.length(3);
    const trigger = mount(wrapper.find('Trigger').props().popup);
    // trigger.update();
    expect(trigger.find('.uxcore-tree-select-tree-checkbox')).to.have.length(1);
  });

  it('remove selected value with showCheckedStrategy=SHOW_ALL', () => {
    const wrapper = mount(
      <TreeSelect
        treeData={[
          { label: 'test1', value: '1' },
          { label: 'test2', value: '2' },
          { label: 'test3', value: '3' },
        ]}
        defaultValue={['1', '2']}
        treeCheckable
        allowClear
        showCheckedStrategy={SHOW_ALL}
      />
    );
    wrapper.find('.uxcore-tree-select-selection__choice__remove').first().simulate('click');
    expect(wrapper.state().value).to.have.length(1);
    expect(wrapper.state().value[0].value).to.equal('2');
  });

  it('remove selected value with showCheckedStrategy=SHOW_PARENT', () => {
    const wrapper = mount(
      <TreeSelect
        treeData={[
          { label: 'test1', value: '1' },
          { label: 'test2', value: '2' },
          { label: 'test3', value: '3' },
        ]}
        defaultValue={['1', '2']}
        treeCheckable
        allowClear
        showCheckedStrategy={SHOW_PARENT}
      />
    );
    wrapper.find('.uxcore-tree-select-selection__choice__remove').first().simulate('click');
    expect(wrapper.state().value).to.have.length(1);
    expect(wrapper.state().value[0].value).to.equal('2');
  });

  it('clear selected value and input value', () => {
    const treeData = [
      {
        key: '0',
        value: '0',
        label: 'label0',
      },
    ];

    const wrapper = mount(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        allowClear
        treeCheckStrictly
        showCheckedStrategy={SHOW_PARENT}
      />
    );
    // open
    wrapper.find('.uxcore-tree-select').simulate('click');
    const trigger = mount(wrapper.find('Trigger').props().popup);
    trigger.find('.uxcore-tree-select-tree-checkbox').at(0).simulate('click');
    wrapper.find('input').simulate('change', { target: { value: 'foo' } });
    wrapper.find('.uxcore-tree-select-selection__clear').simulate('click');
    expect(JSON.stringify(wrapper.state().value)).to.equal(JSON.stringify([]));
    expect(wrapper.state().inputValue).to.be('');
  });
});
