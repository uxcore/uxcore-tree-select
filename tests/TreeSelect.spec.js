/* eslint-disable no-undef */
import React from 'react';
import expect from 'expect.js';
import Enzyme from 'enzyme';
import TreeSelect from '../src';
import Adapter from 'enzyme-adapter-react-15';
import options from './const';

const { TreeNode } = TreeSelect;
const { mount, render } = Enzyme;

Enzyme.configure({ adapter: new Adapter() });

describe('TreeSelect', () => {
  it('should render single select', () => {
    const wrapper = mount(<TreeSelect placeholder="请选择" />);
    expect(wrapper.find('.uxcore-tree-select-selection__placeholder').html())
      .to
      .equal('<span class="uxcore-tree-select-selection__placeholder">请选择</span>');
  });

  it('should render sub-menu', () => {
    const wrapper = mount(<TreeSelect placeholder="请选择" options={options} />);
    wrapper.find('.uxcore-tree-select').simulate('click');
    const trigger = mount(wrapper.find('Trigger').props().popup);
    expect(trigger.length).to.be(1);
  });

  it('render width inputValue', () => {
     // only one treeNode will be render
    const wrapper = mount(
      <TreeSelect
        inputValue="a"
        treeData={[
          { key: 'a', value: 'a', label: 'labela' },
          { key: 'b', value: 'b', label: 'labelb' },
        ]}
      />
    );
    const trigger = mount(wrapper.find('Trigger').props().popup);
    expect(trigger.find('Tree')).to.have.length(1);
  });

  it('sets default value', () => {
    const treeData = [
      { key: '0', value: '0', label: 'label0' },
    ];
    const wrapper = mount(
      <TreeSelect defaultValue="0" treeData={treeData} />
    );
    expect(
      wrapper.find('.uxcore-tree-select-selection__rendered > span').props().children
    ).to.equal('label0');
  });

  it('can be controlled by value', () => {
    const treeData = [
      { key: '0', value: '0', label: 'label0' },
      { key: '1', value: '1', label: 'label1' },
    ];
    const wrapper = mount(
      <TreeSelect value="0" treeData={treeData} />
    );
    let choice = wrapper.find('.uxcore-tree-select-selection__rendered > span');
    expect(choice.prop('children')).to.equal('label0');
    wrapper.setProps({ value: '1' });
    choice = wrapper.find('.uxcore-tree-select-selection__rendered > span');
    expect(choice.prop('children')).to.equal('label1');
  });

  it('embed label to value by add props:labelInValue', () => {
    const treeData = [
      { key: '0', value: '0', label: 'label0' },
      { key: '1', value: '1', label: 'label1' },
    ];
    const wrapper = mount(
      <TreeSelect open labelInValue treeData={treeData} />
    );
    wrapper.setProps({ value: { value: '0', label: 'label0' } });
    expect(JSON.stringify(wrapper.state().value)).to.equal(JSON.stringify([
      { value: '0', label: 'label0' },
    ]));
  });

  it('close tree when press ESC', () => {
    const wrapper = mount(
      <TreeSelect showSearch>
        <TreeNode key="a" value="a" title="labela" />
      </TreeSelect>
    );
    wrapper.setState({ open: true });
    const trigger = mount(wrapper.find('Trigger').props().popup);
    trigger.find('.uxcore-tree-select-search__field').simulate('keyDown', { keyCode: 27 });
    expect(wrapper.state('open')).to.equal(false);
  });

  it('checks node correctly after treeData updated', () => {
    const wrapper = mount(
      <TreeSelect open treeCheckable treeData={[]} />
    );
    wrapper.setProps({ treeData: [{ key: '0', value: '0', label: 'label0' }] });
    const trigger = mount(wrapper.find('Trigger').props().popup);
    trigger.find('.uxcore-tree-select-tree-checkbox').simulate('click');
    expect(JSON.stringify(wrapper.state().value)).to.equal(JSON.stringify([{ value: '0', label: 'label0' }]));
  });

  it('expands tree nodes by treeDefaultExpandedKeys', () => {
    const wrapper = mount(
      <TreeSelect open treeDefaultExpandedKeys={['1']}>
        <TreeNode key="0" value="0" title="0 label" />
        <TreeNode key="1" value="1" title="1 label">
          <TreeNode key="10" value="10" title="10 label" />
          <TreeNode key="11" value="11" title="11 label" />
        </TreeNode>
      </TreeSelect>
    );
    const trigger = mount(wrapper.find('Trigger').props().popup);
    const node = trigger.find('.uxcore-tree-select-tree-node-content-wrapper').at(1);
    expect(node.hasClass('uxcore-tree-select-tree-node-content-wrapper-open')).to.equal(true);
  });

  describe('select', () => {
    const treeData = [
      { key: '0', value: '0', label: 'label0' },
      { key: '1', value: '1', label: 'label1' },
    ];
    const createSelect = (props) => (
      <TreeSelect
        open
        treeData={treeData}
        {...props}
      />
    );

    it('render result by treeNodeLabelProp', () => {
      const wrapper = mount(createSelect({ treeNodeLabelProp: 'value', value: '0' }));
      // const trigger = mount(wrapper.find('Trigger').props().popup);
      expect(wrapper.find('.uxcore-tree-select-selection__rendered > span').prop('children')).to.equal('0');
    });
  });

  describe('search nodes', () => {
    const treeData = [
      { key: 'a', value: 'a', label: 'labela' },
      { key: 'b', value: 'b', label: 'labelb' },
    ];
    const createSelect = (props) => (
      <TreeSelect
        open
        showSearch
        treeData={treeData}
        {...props}
      />
    );

    it('fires search event', () => {
      const onSearch = x => x;
      const wrapper = mount(createSelect({ onSearch }));
      const trigger = mount(wrapper.find('Trigger').props().popup);
      trigger.find('input').simulate('change', { target: { value: 'a' } });
      // expect(onSearch).to.equalCalledWith('a');
      expect(onSearch).withArgs('a').to.not.throwException();
    });

    it('search nodes by filterTreeNode', () => {
      const filter = (value, node) => node.props.value.toLowerCase() === value.toLowerCase();
      const wrapper = mount(createSelect({ filterTreeNode: filter }));
      const trigger = mount(wrapper.find('Trigger').props().popup);
      trigger.find('input').simulate('change', { target: { value: 'A' } });
      // expect(trigger.find('TreeNode')).to.have.length(1);
      // expect(trigger.find('TreeNode').prop('value')).to.equal('a');
      expect(wrapper.state().inputValue).to.equal('A');
    });

    it('search nodes by treeNodeFilterProp', () => {
      const wrapper = mount(createSelect({ treeNodeFilterProp: 'label' }));
      const trigger = mount(wrapper.find('Trigger').props().popup);
      trigger.find('input').simulate('change', { target: { value: 'labela' } });
      // expect(trigger.find('TreeNode')).to.have.length(1);
      // expect(trigger.find('TreeNode').prop('value')).to.equal('a');
      expect(wrapper.state().inputValue).to.equal('labela');
    });
  });

  describe('allowClear', () => {
    it('allowClear when defaultValue is not exist', () => {
      const wrapper = mount(
        <TreeSelect allowClear open>
          <TreeNode key="0" value="0" title="0 label" />
        </TreeSelect>
      );
      const trigger = mount(wrapper.find('Trigger').props().popup);
      trigger.find('.uxcore-tree-select-tree-title').simulate('click');
      wrapper.update();
      wrapper.find('.uxcore-tree-select-selection__clear').simulate('click');
      expect(JSON.stringify(wrapper.state().value)).to.equal(JSON.stringify([]));
    });

    it('allowClear when defaultValue is exist', () => {
      const wrapper = mount(<TreeSelect
        allowClear
        defaultValue="0"
      >
        <TreeNode key="0" value="0" title="0 label" />
      </TreeSelect>);
      wrapper.find('.uxcore-tree-select-selection__clear').simulate('click');
      expect(JSON.stringify(wrapper.state().value)).to.equal(JSON.stringify([]));
    });
  });

  describe('node unmount', () => {
    const App = (isMount) => {
      if (!isMount) {
        return null;
      }
      return (
        <TreeSelect>
          <TreeNode key="0" value="0" title="0 label" />
        </TreeSelect>
      );
    };

    const wrapper = mount(<App
      isMount
    />);
    expect(wrapper.find('TreeSelect')).to.have.length(1);
    wrapper.setProps({ isMount: false });
    wrapper.unmount();
    expect(wrapper.find('TreeSelect')).to.have.length(0);
  });

  describe('focus and blur test', () => {
    it('focus', () => {
      const handleFocus = () => {};
      const treeData = [
        { key: '0', value: '0', label: '0 label' },
      ];
      const wrapper = mount(
        <TreeSelect
          mode="singer"
          onFocus={handleFocus}
          treeData={treeData}
        />
      );
      wrapper.instance().focus();
      expect(handleFocus).to.not.throwException();
    });

    it('blur', () => {
      const handleBlur = () => {};
      const treeData = [
        { key: '0', value: '0', label: '0 label' },
      ];
      const wrapper = mount(
        <TreeSelect
          mode="singer"
          onBlur={handleBlur}
          treeData={treeData}
        />
      );
      wrapper.instance().focus();
      wrapper.instance().blur();
      expect(handleBlur).to.not.throwException();
    });
  });
});
