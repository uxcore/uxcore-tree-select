/**
 * TreeSelect Component Demo for uxcore
 * @author biangang.bg
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import classnames from 'classnames'; 
import TreeSelect, { TreeNode, SHOW_PARENT } from '../src';

function generateData(x = 3, y = 2, z = 1, gData = []) {
  // x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
  function _loop(_level, _preKey, _tns) {
    const preKey = _preKey || '0';
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`;
      tns.push({label: `${key}-label`, value: `${key}-value`, key, disabled: key === '0-0-0-1' ? true : false});
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

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            inputValue: '0-0-0-label',
            value: '0-0-0-value',
            multipleValue: [],
            simpleTreeData: [
                {'key': 1, 'pId': 0, 'label': 'test1'},
                {'key': '1-1', 'pId': 0, 'label': 'test1'},
                {'key': 11, 'pId': 1, 'label': 'test11'},
                {'key': 12, 'pId': 1, 'label': 'test12'},
                {'key': 111, 'pId': 11, 'label': 'test111'},
            ],
            treeDataSimpleMode: {
                id: 'key',
                rootPId: 0,
            }
        }
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
        this.setState({value});
    }
    onMultipleChange(value) {
        console.log('onMultipleChange', arguments);
        this.setState({multipleValue: value});
    }
    onSelect() {
        // use onChange instead
        console.log(arguments);
    }
    filterTreeNode(input, child) {
        return String(child.props.title).indexOf(input) === 0;
    }
    render() {
        return (
        <div style={{margin: 20}}>
            <h2>single select</h2>
            <TreeSelect style={{width: 300}}
                dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                placeholder={<i>请下拉选择</i>}
                searchPlaceholder="please search"
                allowClear treeLine
                inputValue={this.state.inputValue}
                value={this.state.value}
                treeData={gData}
                treeNodeFilterProp="label"
                filterTreeNode={false}
                onSearch={this.onSearch.bind(this)}
                onChange={this.onChange.bind(this)}
                onSelect={this.onSelect.bind(this)} />

            <h2>multiple select</h2>
            <TreeSelect style={{width: 300}} 
                dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                placeholder={<i>请下拉选择</i>}
                searchPlaceholder="please search"
                multiple
                value={this.state.multipleValue}
                treeData={gData}
                treeNodeFilterProp="title"
                onChange={this.onMultipleChange.bind(this)}
                onSelect={this.onSelect.bind(this)} />

            <h2>check select</h2>
            <TreeSelect style={{width: 300}} 
                dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 } }}
                placeholder={<i>请下拉选择</i>}
                searchPlaceholder="please search"
                treeLine maxTagTextLength={10}
                inputValue={null}
                value={this.state.value}
                treeData={gData}
                treeNodeFilterProp="title"
                treeCheckable showCheckedStrategy={SHOW_PARENT}
                onChange={this.onChange.bind(this)}
                onSelect={this.onSelect.bind(this)} />

            <h2>use treeDataSimpleMode</h2>
            <TreeSelect style={{width: 300}}
                dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                placeholder={<i>请下拉选择</i>}
                searchPlaceholder="please search"
                treeLine maxTagTextLength={10}
                inputValue={'test111'}
                value={this.state.value}
                treeData={this.state.simpleTreeData}
                treeNodeFilterProp="title"
                treeDataSimpleMode={this.state.treeDataSimpleMode}
                treeCheckable showCheckedStrategy={SHOW_PARENT}
                onChange={this.onChange.bind(this)}
                onSelect={this.onSelect.bind(this)} />

            <h2>use TreeNode Component (not recommend)</h2>
            <TreeSelect style={{width: 200}}
                dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                value={this.state.value || 'leaf1'}
                treeDefaultExpandAll treeCheckable
                treeNodeFilterProp="title"
                filterTreeNode={this.filterTreeNode}
                onChange={this.onChange.bind(this)}>
            <TreeNode value="parent 1" title="parent 1" key="0-1">
                <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-0">
                <TreeNode value="leaf1" title="my leaf" key="random" />
                <TreeNode value="leaf2" title="your leaf" key="random1" disabled />
                </TreeNode>
                <TreeNode value="parent 1-1" title="parent 1-1" key="0-1-1">
                <TreeNode value="sss" title={<span style={{color: 'red'}}>sss</span>} key="random3" />
                <TreeNode value="same value" title="same txtle" key="0-1-1-1">
                    <TreeNode value="same value" title="same titlexd" key="0-1-1-1-0" />
                </TreeNode>
                </TreeNode>
            </TreeNode>
            <TreeNode value="same value" title="same title" key="0-2">
                <TreeNode value="2same value" title="2same title" key="0-2-0" />
            </TreeNode>
            <TreeNode value="same value" title="same title" key="0-3" />
            <TreeNode value="same value" title="same title" key="0-4" />
            <TreeNode value="same value" title="same title" key="0-5" />
            </TreeSelect>
        </div>
        );
    }
};

export default Demo;