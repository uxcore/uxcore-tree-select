import React from 'react';
import expect from 'expect.js';
import Enzyme from 'enzyme';
import TreeSelect from '../src';
import Adapter from 'enzyme-adapter-react-15';
import options from './const';

const { mount, render } = Enzyme;

Enzyme.configure({ adapter: new Adapter() });

describe('Tree Right', () => {
  const treeData = [
    { key: 'a', value: 'a', label: 'labela' },
    { key: 'b', value: 'b', label: 'labelb' },
  ];
  const treeData2 = [
    { key: 'a', value: 'a', label: 'labela', children: [
      { key: 'b', value: 'b', label: 'labelb' },
    ] },
  ];
  it('single select have no right tree', () => {
    const wrapper = mount(
      <TreeSelect
        treeData={treeData}
        resultsPanelTitle="haha"
        open
      />
    );
    const trigger = mount(wrapper.find('Trigger').props().popup);
    expect(trigger.find('.uxcore-tree-select-dropdown-right-title').length).to.equal(0);
  });

  it('render  title', () => {
    const wrapper = mount(
      <TreeSelect
        multiple
        treeData={treeData}
        resultsPanelTitle="haha"
        open
      />
    );
    const trigger = mount(wrapper.find('Trigger').props().popup);
    expect(trigger.find('.uxcore-tree-select-dropdown-right-title').text()).to.equal('haha');
  });

  it('render chooseable number', () => {
    const wrapper = mount(
      <TreeSelect
        multiple
        defaultValue={['a', 'b']}
        treeData={treeData}
        resultsPanelTitle="haha"
        open
      />
    );
    const trigger = mount(wrapper.find('Trigger').props().popup);
    expect(trigger.find('.uxcore-tree-select-dropdown-right-selected-number').text()).to.equal('（2）');
  });

  it('allow to expend', () => {
    const wrapper = mount(
      <TreeSelect
        defaultValue={'a'}
        treeData={treeData2}
        multiple
        resultsPanelTitle="haha"
        open
      />
    );
    const trigger = mount(wrapper.find('Trigger').props().popup);
    trigger.find('.uxcore-tree-select-rightTreeNode-arrow-close').simulate('click');
    expect(trigger.find('.uxcore-tree-select-rightTreeNode-label')).to.have.length(2);
  });

  it('not allow to expend when treeCheckStrictly equal true', () => {
    const wrapper = mount(
      <TreeSelect
        treeCheckStrictly
        defaultValue={'a'}
        treeData={treeData2}
        resultsPanelTitle="haha"
        open
      />
    );
    const trigger = mount(wrapper.find('Trigger').props().popup);
    expect(trigger.find('.uxcore-tree-select-rightTreeNode-arrow-close')).to.have.length(0);
  });

  it('allow to remove', () => {
    const wrapper = mount(
      <TreeSelect
        defaultValue={'a'}
        treeData={treeData}
        multiple
        resultsPanelTitle="haha"
        open
      />
    );
    const trigger = mount(wrapper.find('Trigger').props().popup);
    trigger.find('.uxcore-tree-select-rightTreeNode-clear').simulate('click');
    expect(wrapper.state().value).to.have.length(0);
  });

  it('allow to removeAll', () => {
    const wrapper = mount(
      <TreeSelect
        multiple
        defaultValue={['a', 'b']}
        treeData={treeData}
        resultsPanelTitle="haha"
        open
      />
    );
    const trigger = mount(wrapper.find('Trigger').props().popup);
    trigger.find('.uxcore-tree-select-dropdown-right-allClear').simulate('click');
    expect(wrapper.state().value).to.have.length(0);
  });
});
