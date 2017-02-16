/**
 * TreeSelect Component Demo for uxcore
 * @author biangang.bg
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import TreeSelect, { TreeNode, SHOW_PARENT } from '../src';

function generateData(x = 3, y = 2, z = 1, gData = []) {
  // x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
  function _loop(_level, _preKey, _tns) {
    const preKey = _preKey || '0';
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`;
      tns.push({ label: `${key}-label`, value: `${key}-value`, key, disabled: key === '0-0-0-1' });
      if (i < y) {
        children.push(key);
      }
    }
    if (_level < 0) {
      return tns;
    }
    const __level = _level - 1;
    children.forEach((key, index) => {
      tns[index].children = [];
      return _loop(__level, key, tns[index].children);
    });
  }
  _loop(z);
  return gData;
}

let gData = generateData();
console.log(gData);
class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      inputValue: '0-0-0-label',
      value: '0-0-0-value',
      multipleValue: [],
      simpleTreeData: [
        { key: 1, pId: 0, label: 'test1', value: '1' },
        { key: 2, pId: 0, label: 'test2', value: '2' },
        { key: 11, pId: 1, label: 'test11', value: '3' },
        { key: 12, pId: 2, label: 'test12', value: '4' },
        { key: 111, pId: 11, label: 'test111', value: 'a' },
      ],
      treeDataSimpleMode: {
        id: 'key',
        rootPId: 0,
      },
    };
  }

  onClick() {
    this.setState({
      visible: true,
    });
  }

  onClose() {
    this.setState({
      visible: false,
    });
  }
  onSearch(value) {
    console.log(value, arguments);
  }
  onChange(value) {
    console.log('onChange', arguments);
    this.setState({ value });
  }
  onMultipleChange(value) {
    console.log('onMultipleChange', arguments);
    this.setState({ multipleValue: value });
  }
  onSelect() {
    // use onChange instead
    console.log('onselect', arguments);
  }
  filterTreeNode(input, child) { // 开头符合过滤
    return String(child.props.title).indexOf(input) === 0;
  }
  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>single select</h2>
        <TreeSelect
          style={{ width: 300 }}
          dropdownMatchSelectWidth
          resultsPanelTitle={<em>1231</em>}
          resultsPanelTitleStyle={{ color: 'red' }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          allowClear
          showSearch
          inputValue={this.state.inputValue}
          value={this.state.value}
          treeData={gData}
          treeNodeFilterProp="label"
          onSearch={this.onSearch.bind(this)}
          onChange={this.onChange.bind(this)}
          onSelect={this.onSelect.bind(this)}
        />

        <h2>multiple select</h2>
        <TreeSelect
          style={{ width: 300 }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          multiple
          value={this.state.multipleValue}
          treeData={gData}
          treeNodeFilterProp="title"
          onChange={this.onMultipleChange.bind(this)}
          onSelect={this.onSelect.bind(this)}
          filterResultsPanel={false}
          resultsPanelAllClearBtn={false}
        />

        <h2>check select</h2>
        <TreeSelect
          style={{ width: 300 }}
          dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 } }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          maxTagTextLength={10}
          showSearch
          inputValue={null}
          value={this.state.value}
          treeData={gData}
          treeNodeFilterProp="title"
          treeCheckable showCheckedStrategy={'SHOW_ALL'}
          onChange={this.onChange.bind(this)}
          onSelect={this.onSelect.bind(this)}
        />

        <h2>use treeDataSimpleMode</h2>
        <TreeSelect
          style={{ width: 300 }}
          placeholder={<i>请下拉选择</i>}
          searchPlaceholder="please search"
          maxTagTextLength={10}
          value={this.state.value}
          treeData={this.state.simpleTreeData}
          treeNodeFilterProp="title"
          treeDataSimpleMode={this.state.treeDataSimpleMode}
          treeCheckable showCheckedStrategy={SHOW_PARENT}
          onChange={this.onChange.bind(this)}
          onSelect={this.onSelect.bind(this)}
        />

        <h2>use TreeNode Component (not recommend)</h2>
        <TreeSelect
          style={{ width: 200 }}
          value={this.state.value || 'leaf1'}
          treeDefaultExpandAll treeCheckable
          treeNodeFilterProp="title"
          filterTreeNode={this.filterTreeNode}
          onChange={this.onChange.bind(this)}
        >
          <TreeNode value="parent 1" title="parent 1" key="0-1">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-0">
              <TreeNode value="leaf1" title="my leaf" key="0-1-0-0" />
              <TreeNode value="leaf2" title="your leasdsassf" key="0-1-0-1" disabled />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-sadsadsasdasa1" key="0-1-1">
              <TreeNode
                value="sss"
                title={<span style={{ color: 'red' }}>sss</span>}
                key="0-1-1-0"
              />
              <TreeNode value="same value3" title="same txtle" key="0-1-1-1">
                <TreeNode
                  value="same value4"
                  title="2sisdsadsadsadsadasdasdastle"
                  key="0-1-1-1-0"
                />
              </TreeNode>
            </TreeNode>
          </TreeNode>
          <TreeNode value="same value5" title="same titasdasdasdsdasdasdsadale" key="0-2">
            <TreeNode value="2same value" title="2sametisdsadsadsadsadsadasdasdastle" key="0-2-0" />
          </TreeNode>
          <TreeNode value="same value6" title="same titleasdsadsdsa3" key="0-3" />
          <TreeNode value="same value7" title="same titlsdasdsadasse4" key="0-4" />
          <TreeNode value="same value8" title="same titl6e" key="0-5" />
        </TreeSelect>
      </div>
    );
  }
}

export default Demo;
