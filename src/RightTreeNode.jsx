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
    } else if (model === 'check') { // checkedPositions, checkedNodes
      const { checkedNodesPositions } = _treeNodesStates;
      let node;
      let pos;

      const checkedPositions = checkedNodesPositions.map(item => item.pos);
      // } else {
      //   checkedNodesPositions = [];
      //   checkedPositions = _treeNodesStates.checkedPositions;
      //   _treeNodesStates.checkedNodes.forEach((item, index) => {
      //     const bak = item.node ? item.node : item;
      //     checkedNodesPositions.push({
      //       node: bak,
      //       pos: checkedPositions[index],
      //     });
      //   });
      // }

      checkedNodesPositions.forEach(item => {
        if (item.node.props.value === value) {
          node = item.node;
          pos = item.pos;
        }
      });
      const poses = filterCheckedKeysBaseKey(checkedPositions, pos);

      const checkedNodes = checkedNodesPositions
        .filter(item => poses.indexOf(item.pos) > -1)
        .map(item => item.node);

      const info = {
        event: 'check',
        checked: false,
        node,
        checkedNodesPositions: checkedNodesPositions
          .filter(item => poses.indexOf(item.pos) > -1)
          .map(item => ({
            node: item.node,
            pos: item.pos,
          })),
        checkedNodes,
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
    const { treeNodeLabelProp, children, isAll, prefixCls, level, maxTagTextLength } = this.props;
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

    let content = this.props[treeNodeLabelProp];

    if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
      content = (<span title={this.props[treeNodeLabelProp]}>
        {`${content.slice(0, maxTagTextLength)}...`}</span>);
    }

    return (
      <div>
        <div className={`${prefixCls}-hoverNode`} style={paddingLeftStyle}>
          {
            children ?
              <span onClick={this.expand} className={classnames(arrowCls)} />
            : null
          }
          {content}
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
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.object]),
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
  maxTagTextLength: PropTypes.number,
};
