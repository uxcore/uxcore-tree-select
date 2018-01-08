import React from 'react';
import expect from 'expect.js';
import Enzyme from 'enzyme';
import TreeSelect from '../src';
import Adapter from 'enzyme-adapter-react-15';

const { mount, render } = Enzyme;

Enzyme.configure({ adapter: new Adapter() });

const options = [{
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州',
    children: [{
      value: 'xihu',
      label: '西湖',
    }],
  }],
  }, {
    value: 'jiangsu',
    label: '江苏',
    children: [{
      value: 'nanjing',
      label: '南京',
      children: [{
        value: 'zhonghuamen',
        label: '中华门',
      }],
    }],
  }];

describe('<TreeSelect />', () => {
  it('should render single select', () => {
    const wrapper = mount(<TreeSelect placeholder="请选择" />);
    expect(wrapper.find('.uxcore-tree-select-selection__placeholder').html())
      .to
      .equal('<span class="uxcore-tree-select-selection__placeholder">请选择</span>');
  });

  it('should render sub-menu', () => {
    const wrapper = mount(<TreeSelect placeholder="请选择" options={options} />);
    wrapper.find('.uxcore-tree-select').simulate('click');
    const dropdownWrapper = mount(wrapper.find('Trigger').prop('popup'));
    expect(dropdownWrapper.length).to.be(1);
  });

  it('sets default value', () => {
    const treeData = [
      { key: '0', value: '0', label: 'label0' },
    ];
    const wrapper = mount(
      <TreeSelect defaultValue="0" treeData={treeData} />
    );
    expect(
      wrapper.find('.uxcore-tree-select-selection__rendered > span').text()
    ).equal('label0');
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
    expect(choice.text()).to.equal('label0');
    wrapper.setProps({ value: '1' });
    choice = wrapper.find('.uxcore-tree-select-selection__rendered > span');
    expect(choice.text()).to.equal('label1');
  });
});

// describe('click status', () => {
//   const treeData = [
//     { key: 'a', value: 'a', label: 'labela' },
//     { key: 'b', value: 'b', label: 'labelb' },
//   ];

//   it('render dropdown', () => {
//     const wrapper = mount(<TreeSelect  placeholder="请选择" showSearch treeData={treeData} /> );
//     wrapper.find('.uxcore-tree-select').simulate('click');
//     wrapper.find('.uxcore-tree-select-search__field').simulate('change','a');
//     expect(wrapper.find('.filter-node').text()).to.equal('labela');
//   });
// });