/**
 * TreeSelect Component Demo for uxcore
 * @author biangang.bg
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import classnames from 'classnames'; 
import TreeSelect, { TreeNode, SHOW_PARENT, SHOW_ALL, SHOW_CHILD } from '../src';

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

console.log(gData, 'gData')
class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            inputValue: '0-0-0-label',
            value: '0-0-1-value',
            multipleValue: [],
            simpleTreeData: [
                {'key': 1, 'pId': 0, 'label': 'test1', value: "1"},
                {'key': '1-1', 'pId': 0, 'label': 'test1',value: "2"},
                {'key': 11, 'pId': 1, 'label': 'test11',value: "3"},
                {'key': 12, 'pId': 1, 'label': 'test12',value: "4"},
                {'key': 111, 'pId': 11, 'label': 'test111',value: "5"},
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
        console.log(arguments, 'onSelect');
    }
    filterTreeNode(input, child) {
        console.log(input, child, 'test');
        return String(child.props.title).indexOf(input) === 0;
    }

    onClick(e) {
        console.log(e, 'click')
    }
    render() {
        return (
        <div style={{margin: 20}}>
            <h2>single select</h2>

 
            <h2>check select</h2>
            <TreeSelect style={{width: 300}} 
                dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 } }}
                placeholder={<i>请下拉选择</i>}
                searchPlaceholder="please search"
                treeLine maxTagTextLength={10}
                multiple
                inputValue={null}
                value={this.state.value}
                treeData={gData}
                treeNodeFilterProp="title"
                treeCheckable showCheckedStrategy={SHOW_PARENT}
                onChange={this.onChange.bind(this)}
                onSelect={this.onSelect.bind(this)} />

          </div>
        );
    }
};

export default Demo;