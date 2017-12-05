/**
 * RightTreeNode Component for Tree
 * @author chenqiu  wb-cq231719@alibaba-inc.com
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { filterCheckedKeysBaseKey } from './utils';
import i18n from './i18n';


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
      const { checkedNodesPositions } = _treeNodesStates;
      let node;
      let pos;

      const checkedPositions = checkedNodesPositions.map(item => item.pos);

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

  getMaxWidth(isSelectNode, paddingLeftStyle) {
    const { locale, children, isAll, dropdownWidth } = this.props;
    // padding:32, delete:26, isALL: 38, arrow: 18
    let padWidth = 20;
    if (isAll || (isSelectNode && children)) {
      padWidth += locale === 'en-us' ? 25 : 36;
    }
    if (isSelectNode) {
      padWidth += locale === 'en-us' ? 38 : 26;
    }
    if (children) {
      padWidth += 18;
    }

    return (dropdownWidth - padWidth - paddingLeftStyle);
  }

  render() {
    const { treeNodeLabelProp, children, isAll, prefixCls, level, locale } = this.props;
    const { expand } = this.state;
    // padding 无箭头 +36  有箭头+18
    let paddingLeft = 0;
    if (level > 1) {
      paddingLeft = !children ? (16 + level * 18) : (16 + (level - 1) * 18);
    } else if (level === 1 && !children) {
      // fix style for the first level label which has no Children
      paddingLeft = 5;
    }
    const arrowCls = {
      [`${prefixCls}-arrow-close`]: !expand,
      [`${prefixCls}-arrow-open`]: expand,
      [`${prefixCls}-arrow-switch`]: true,
    };
    const isSelectNode = this.isSelectNode();

    const maxWidth = this.getMaxWidth(isSelectNode, paddingLeft);

    const content = (<span
      style={{ maxWidth: `${maxWidth}px` }}
      className={`${prefixCls}-label`}
      title={this.props[treeNodeLabelProp]}
    >
      {this.props[treeNodeLabelProp]}
    </span>);

    return (
      <div>
        <div className={`${prefixCls}-hoverNode`} style={{ paddingLeft: `${paddingLeft}px` }}>
          {
            children ?
              <span onClick={this.expand} className={classnames(arrowCls)} />
            : null
          }
          {content}
          {isAll || (isSelectNode && children) ?
            <span className={`${prefixCls}-allSelect`}>{i18n[locale].all}</span> : null}
          {
            isSelectNode ?
              <span className={`${prefixCls}-clear`} onClick={this.removeSelected}>
                {i18n[locale].delete}
              </span>
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
  locale: 'zh-cn',
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
  locale: PropTypes.oneOf(['zh-cn', 'en-us']),
  dropdownWidth: PropTypes.number,
};
