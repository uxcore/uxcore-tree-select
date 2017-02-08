/**
 * RightTreeNode Component for Tree
 * @author chenqiu  wb-cq231719@alibaba-inc.com
 */

import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { filterCheckedKeysBaseKey } from './utils';


export default class RightTreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: !(props.isAll || (this.isSelectNode() && props.children)),
    };

    this.expand = this.expand.bind(this);
    this.removeSelected = this.removeSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAll !== nextProps.isAll) {
      this.setState({
        expand: !nextProps.isAll,
      });
    }
  }

  expand() {
    this.setState({
      expand: !this.state.expand,
    });
  }


  removeSelected() {
    const { onFireChange, onClearInputValue, onRemoveChecked, value,
      model, _treeNodesStates, vls } = this.props;

    if (model === 'select') {
      onFireChange(vls.filter(item => item.value !== value));
      onClearInputValue();
      // todo optimize--隐藏删除
    } else if (model === 'check') {
      const { checkedNodes, checkedKeys } = _treeNodesStates;
      let node;
      let key;
      checkedNodes.forEach(item => {
        const iBak = item.node ? item.node : item;
        if (iBak.props.value === value) {
          node = iBak;
          key = iBak.key;
        }
      });
      const keys = filterCheckedKeysBaseKey(checkedKeys, key);
      const checkedNodesPositions = [];
      checkedNodes.forEach(item => {
        const iBak = item.node ? item.node : item;
        if (keys.indexOf(iBak.key) > -1) {
          checkedNodesPositions.push({
            node: iBak,
            pos: iBak.key,
          });
        }
      });
      const checkedNodesToPara =
        checkedNodes.filter(item => checkedNodesPositions.indexOf(item.key) > -1);

      const info = {
        event: 'check',
        checked: false,
        node,
        checkedNodesPositions,
        checkedNodes: checkedNodesToPara,
      };
      onRemoveChecked('', info);
    }

    // todo 回调
  }

  isSelectNode() {
    const { model, value, _treeNodesStates, vls, pos } = this.props;

    if (model === 'select') {
      return vls.map(item => item.value).indexOf(value) > -1;
    } else if (model === 'check') {
      const checkVls = _treeNodesStates && _treeNodesStates.checkedKeys || [];
      return checkVls.indexOf(pos) > -1;
    }

    return false;
  }

  render() {
    const { treeNodeLabelProp, children, isAll, prefixCls, level } = this.props;
    const { expand } = this.state;
    // padding 无箭头 +36  有箭头+18
    const paddingLeftStyle = {};
    if (level > 1) {
      paddingLeftStyle.paddingLeft =
        !children ? `${16 + level * 18}px` : `${16 + (level - 1) * 18}px`;
    }
    const arrowCls = {
      [`${prefixCls}-arrow-close`]: !expand,
      [`${prefixCls}-arrow-open`]: expand,
      [`${prefixCls}-arrow-switch`]: true,
    };

    return (
      <div>
        <div className={`${prefixCls}-hoverNode`} style={paddingLeftStyle}>
          {
            children ?
              <span onClick={this.expand} className={classnames(arrowCls)} />
            : null
          }
          {this.props[treeNodeLabelProp]}
          {isAll || (this.isSelectNode() && children) ?
            <span className={`${prefixCls}-allSelect`}>全选</span> : null}
          {
            this.isSelectNode() ?
              <span className={`${prefixCls}-clear`} onClick={this.removeSelected}>删除</span>
              : null
          }
        </div>
        {
          expand && children ? children : null
        }
      </div>
    );
  }
}

RightTreeNode.defaultProps = {

};

RightTreeNode.propTypes = {
  value: PropTypes.string,
  treeNodeLabelProp: PropTypes.any,
  children: PropTypes.any,
  isAll: PropTypes.bool,
  prefixCls: PropTypes.string,
  level: PropTypes.number,
  model: PropTypes.string,
  onFireChange: PropTypes.func,
  onClearInputValue: PropTypes.func,
  onRemoveChecked: PropTypes.func,
  _treeNodesStates: PropTypes.object,
  vls: PropTypes.array,
  pos: PropTypes.string,
};
