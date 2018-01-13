/* eslint-disable no-undef */
import React from 'react';
import Enzyme from 'enzyme';
import expect from 'expect.js';
import TreeSelect from '../src';
import Adapter from 'enzyme-adapter-react-15';

const { mount, render } = Enzyme;

Enzyme.configure({ adapter: new Adapter() });

describe('TreeSelect.multiple', () => {
  const treeData = [
    { key: '0', value: '0', label: 'label0' },
    { key: '1', value: '1', label: 'label1' },
  ];
  const createSelect = (props) => (
    <TreeSelect
      treeData={treeData}
      multiple
      {...props}
    />
  );
  const select = (wrapper, index = 0) => {
    // console.log('-----xxxxx-----', wrapper.find('.uxcore-tree-select-tree-node-content-wrapper'));
    wrapper.find('.uxcore-tree-select-tree-node-content-wrapper').at(index).simulate('click');
  };

  it('render by inputValue', () => {
    const wrapper = mount(createSelect({ inputValue: '0' }));
    const choices = wrapper.find('.uxcore-tree-select-search__field');
    expect(choices.prop('value')).to.equal('0');
  });

  it('select multiple nodes', () => {
    const wrapper = mount(createSelect({ open: true }));
    const trigger = mount(wrapper.find('Trigger').props().popup);
    select(trigger, 0);
    select(trigger, 1);
    wrapper.update();
    const result = wrapper.find('.uxcore-tree-select-selection__choice');
    const choices = wrapper.find('.uxcore-tree-select-selection__choice__content');
    expect(result).to.have.length(2);
    expect(choices.at(0).prop('children')).to.be('label0');
    expect(choices.at(1).prop('children')).to.be('label1');
  });

  it('remove selected node', () => {
    const wrapper = mount(createSelect({ defaultValue: ['0', '1'] }));
    wrapper.find('.uxcore-tree-select-selection__choice__remove').first().simulate('click');
    // const choice = wrapper.find('.uxcore-tree-select-selection__choice');
    // expect(choice).to.have.length(1);
    // expect(choice.prop('children')).to.be('label1');
    expect(wrapper.state('value')).to.have.length(1);
    expect(wrapper.state('value')[0].label).to.be('label1');
  });

  it('remove by backspace key', () => {
    const wrapper = mount(createSelect({ defaultValue: ['0', '1'] }));
    wrapper.find('input').simulate('keyDown', { keyCode: 8 }); // 回退键
    // const choice = wrapper.find('.uxcore-tree-select-selection__choice__content');
    // expect(choice).to.have.length(1);
    // expect(choice.prop('children')).to.be('label0');
    expect(wrapper.state('value')).to.have.length(1);
    expect(wrapper.state('value')[0].label).to.be('label0');
  });

  it('focus', () => {
    const handleFocus = () => {};
    const treeData2 = [
      { key: '0', value: '0', label: '0 label' },
    ];
    const wrapper = mount(
      <TreeSelect
        multiple
        onFocus={handleFocus}
        treeData={treeData2}
      />
    );
    wrapper.instance().focus();
    expect(handleFocus).to.not.throwException();
  });

  it('blur', () => {
    const handleBlur = () => {};
    const treeData2 = [
      { key: '0', value: '0', label: '0 label' },
    ];
    const wrapper = mount(
      <TreeSelect
        multiple
        onBlur={handleBlur}
        treeData={treeData2}
      />
    );
    wrapper.instance().focus();
    wrapper.instance().blur();
    expect(handleBlur).to.not.throwException();
  });
});
