import React from 'react';
import expect from 'expect.js';
import Enzyme from 'enzyme';
import TreeSelect from '../src';
import Adapter from 'enzyme-adapter-react-15';

const { mount } = Enzyme;

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
});
