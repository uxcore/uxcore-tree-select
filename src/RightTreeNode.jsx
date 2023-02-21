/**
 * RightTreeNode Component for Tree
 * @author chenqiu  wb-cq231719@alibaba-inc.com
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class RightTreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: !(props.isAll || (this.isSelectNode() && props.children)),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAll !== nextProps.isAll) {
      this.setState({
        expand: !nextProps.isAll,
      });
    }
  }

  getMaxWidth(isSelectNode, paddingLeftStyle) {
    const { locale, children, isAll, dropdownWidth, disabled } = this.props;
    // padding:32, delete:26, isALL: 38, arrow: 18
    let padWidth = 20;
    if (isAll || (isSelectNode && children)) {
      padWidth += locale === 'en-us' ? 25 : 36;
    }
    if (isSelectNode && !disabled) {
      padWidth += locale === 'en-us' ? 38 : 26;
    }
    if (children) {
      padWidth += 18;
    }

    return (dropdownWidth - padWidth - paddingLeftStyle);
  }

  removeSelected = () => {
    const { removeSelected, value, position } = this.props;
    removeSelected(value, { position });
  }

  isSelectNode() {
    const { pos, keys } = this.props;

    return keys.indexOf(pos) > -1;
  }

  expand = () => {
    this.setState({
      expand: !this.state.expand,
    });
  }

  render() {
    const { treeNodeLabelProp, children, isAll, prefixCls, level, locale, disabled, treeCheckStrictly, localePack } = this.props;
    const { expand } = this.state;
    // padding 无箭头 +36  有箭头+18
    let paddingLeft = 0;
    if (level > 1) {
      paddingLeft = !children ? (16 + (level - 1) * 18) : (16 + (level - 2) * 18);
    } else if (treeCheckStrictly || level === 1 && !children) {
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

    const content = (
      <span
        style={{ maxWidth: `${maxWidth}px` }}
        className={`${prefixCls}-label`}
        title={this.props[treeNodeLabelProp]}
      >
        {this.props[treeNodeLabelProp]}
      </span>
    );

    if (treeCheckStrictly) {
      paddingLeft = 15;
    }

    return (
      <div>
        <div className={`${prefixCls}-hoverNode`} style={{ paddingLeft: `${paddingLeft}px` }}>
          {
            !treeCheckStrictly && children ?
              <span onClick={this.expand} className={classnames(arrowCls)} />
            : null
          }
          {content}
          {isAll || (!treeCheckStrictly && isSelectNode && children) ?
            <span className={`${prefixCls}-allSelect`}>{localePack.all}</span> : null}
          {
            (isSelectNode && !disabled) ?
              <span className={`${prefixCls}-clear`} onClick={this.removeSelected}>
                {localePack.delete}
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
  localePack: {},
  keys: [],
};

RightTreeNode.propTypes = {
  position: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.object]),
  treeNodeLabelProp: PropTypes.any,
  children: PropTypes.any,
  treeCheckStrictly: PropTypes.bool,
  isAll: PropTypes.bool,
  prefixCls: PropTypes.string,
  level: PropTypes.number,
  removeSelected: PropTypes.func,
  pos: PropTypes.string,
  locale: PropTypes.oneOf(['zh-cn', 'en-us']),
  localePack: PropTypes.object,
  dropdownWidth: PropTypes.number,
  keys: PropTypes.array,
  disabled: PropTypes.bool,
};
