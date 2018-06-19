/**
 * RightTreeNode Component for Tree
 * @author chenqiu  wb-cq231719@alibaba-inc.com
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import i18n from './i18n';

export default class RightTreeNode extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.isAll !== state.prevIsAll) {
      return {
        expand: !props.isAll,
        prevIsAll: props.isAll,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      expand: !(props.isAll || (this.isSelectNode() && props.children)),
    };
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
    const { removeSelected, value } = this.props;

    removeSelected(value);
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
    const { treeNodeLabelProp, children, isAll, prefixCls, level, locale, disabled } = this.props;
    const { expand } = this.state;
    // padding 无箭头 +36  有箭头+18
    let paddingLeft = 0;
    if (level > 1) {
      paddingLeft = !children ? (16 + (level - 1) * 18) : (16 + (level - 2) * 18);
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
            (isSelectNode && !disabled) ?
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
  keys: [],
};

RightTreeNode.propTypes = {
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.object]),
  treeNodeLabelProp: PropTypes.any,
  children: PropTypes.any,
  isAll: PropTypes.bool,
  prefixCls: PropTypes.string,
  level: PropTypes.number,
  removeSelected: PropTypes.func,
  pos: PropTypes.string,
  locale: PropTypes.oneOf(['zh-cn', 'en-us']),
  dropdownWidth: PropTypes.number,
  keys: PropTypes.array,
  disabled: PropTypes.bool,
};
