// customized rc-tree-select  https://github.com/react-component/tree-select/blob/master/src/SelectTrigger.jsx

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import Trigger from 'rc-trigger';
import Tree, { TreeNode } from 'rc-tree';
import {
  loopAllChildren,
  getValuePropValue,
  labelCompatible,
  saveRef,
} from 'rc-tree-select/lib/util';
import toArray from 'rc-util/lib/Children/toArray';
import { flatToHierarchy } from './utils';
import RightTreeNode from './RightTreeNode';


const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

class SelectTrigger extends Component {
  static propTypes = {
    treeCheckStrictly: PropTypes.bool,
    dropdownMatchSelectWidth: PropTypes.bool,
    dropdownPopupAlign: PropTypes.object,
    visible: PropTypes.bool,
    filterTreeNode: PropTypes.any,
    treeNodes: PropTypes.any,
    inputValue: PropTypes.string,
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    children: PropTypes.any,
    removeSelected: PropTypes.func,
    value: PropTypes.array,
    locale: PropTypes.string,
    localePack: PropTypes.object,
    onAllClear: PropTypes.func,
    resultsPanelAllClearBtn: PropTypes.bool,
    resultsPanelTitle: PropTypes.any,
    resultsPanelTitleStyle: PropTypes.object,
  };

  state = {
    _expandedKeys: [],
    fireOnExpand: false,
    dropdownWidth: null,
  };

  componentDidMount() {
    this.setDropdownWidth();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inputValue && nextProps.inputValue !== this.props.inputValue) {
      // set autoExpandParent to true
      this.setState({
        _expandedKeys: [],
        fireOnExpand: false,
      });
    }
  }

  componentDidUpdate() {
    this.setDropdownWidth();
  }

  onResultsPanelAllClear = () => {
    this.props.onAllClear();
  }

  onExpand = (expandedKeys) => {
    // rerender
    this.setState({
      _expandedKeys: expandedKeys,
      fireOnExpand: true,
    }, () => {
      // Fix https://github.com/ant-design/ant-design/issues/5689
      if (this.trigger && this.trigger.forcePopupAlign) {
        this.trigger.forcePopupAlign();
      }
    });
  }

  setDropdownWidth() {
    const width = ReactDOM.findDOMNode(this).offsetWidth;
    if (width !== this.state.dropdownWidth) {
      this.setState({ dropdownWidth: width });
    }
  }

  getPopupEleRefs() {
    return this.popupEle;
  }

  getPopupDOMNode() {
    return this.trigger.getPopupDomNode();
  }

  getDropdownTransitionName() {
    const props = this.props;
    let transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${this.getDropdownPrefixCls()}-${props.animation}`;
    }
    return transitionName;
  }

  getDropdownPrefixCls() {
    return `${this.props.prefixCls}-dropdown`;
  }

  highlightTreeNode = (treeNode) => {
    const props = this.props;
    const filterVal = treeNode.props[labelCompatible(props.treeNodeFilterProp)];
    if (typeof filterVal === 'string') {
      return props.inputValue && filterVal.indexOf(props.inputValue) > -1;
    }
    return false;
  }

  filterTreeNode = (input, child) => {
    if (!input) {
      return true;
    }
    const filterTreeNode = this.props.filterTreeNode;
    if (!filterTreeNode) {
      return true;
    }
    if (child.props.disabled) {
      return false;
    }
    return filterTreeNode.call(this, input, child);
  }

  filterSelectedTreeNode(valueArr, child) {
    if (valueArr.indexOf(child.props.value) > -1) {
      return true;
    }
    return false;
  }

  processSelectedTreeNode(treeNodes) { // 筛选已经选中的treeNode并重组
    const filterPoss = [];
    const { value, treeCheckStrictly } = this.props;
    const valueArr = value.map(item => item.value);
    loopAllChildren(treeNodes, (child, index, pos) => {
      if (this.filterSelectedTreeNode(valueArr, child)) {
        filterPoss.push(pos);
      }
    });

    let processedPoss = [];
    // Include the filtered nodes's ancestral nodes when treeCheckStrictly is false
    // or only use selected nodes when treeCheckStrictly is true
    // 在treeCheckStrictly为false的时候加入processedPoss包括其祖先节点, 否则只使用选中的节点
    if (treeCheckStrictly) {
      processedPoss = filterPoss;
    } else {
      filterPoss.forEach((pos) => {
        const arr = pos.split('-');
        arr.reduce((pre, cur) => {
          const res = `${pre}-${cur}`;
          if (processedPoss.indexOf(res) < 0) {
            processedPoss.push(res);
          }
          return res;
        });
      });
    }

    // 再筛选一遍将node都push进去
    const filterNodesPositions = [];
    loopAllChildren(treeNodes, (child, index, pos) => {
      if (processedPoss.indexOf(pos) > -1) {
        const renderNode = { node: child, pos, isAll: false };
        // 如果有children就是全选的
        if (filterPoss.indexOf(pos) > -1 && child.props.children) {
          // 如果 treeCheckStrictly 为true, 就不展示子节点了, 也不需要显示"全选"这个文案了.
          if (!treeCheckStrictly) {
            renderNode.isAll = true;
          }
        }
        filterNodesPositions.push(renderNode);
      }
    });

    let hierarchyNodes;
    // 阶层 讲平层转换为阶级数组. flatToHierarchy会把具有层级关系的节点进行合并,去掉被包含的节点.
    // 但是在treeCheckStrictly为true的时候就不能去掉被包含的节点啦
    if (treeCheckStrictly) {
      hierarchyNodes = filterNodesPositions;
    } else {
      hierarchyNodes = flatToHierarchy(filterNodesPositions, true);
    }

    const recursive = children =>
      children.map((child) => {
        if (child.children) {
          return React.cloneElement(child.node, { isAll: child.isAll }, recursive(child.children));
        }
        // 单一节点 本身就包括children
        return React.cloneElement(child.node, { isAll: child.isAll });
      });

    return recursive(hierarchyNodes);
  }

  processTreeNode(treeNodes) {
    const filterPoss = [];
    this._expandedKeys = [];
    loopAllChildren(treeNodes, (child, index, pos) => {
      if (this.filterTreeNode(this.props.inputValue, child)) {
        filterPoss.push(pos);
        this._expandedKeys.push(child.key);
      }
    });

    // Include the filtered nodes's ancestral nodes.
    const processedPoss = [];
    filterPoss.forEach((pos) => {
      const arr = pos.split('-');
      arr.reduce((pre, cur) => {
        const res = `${pre}-${cur}`;
        if (processedPoss.indexOf(res) < 0) {
          processedPoss.push(res);
        }
        return res;
      });
    });
    const filterNodesPositions = [];
    loopAllChildren(treeNodes, (child, index, pos) => {
      if (processedPoss.indexOf(pos) > -1) {
        filterNodesPositions.push({ node: child, pos });
      }
    });

    const hierarchyNodes = flatToHierarchy(filterNodesPositions);

    const recursive = (children) => {
      return children.map((child) => {
        if (child.children) {
          return React.cloneElement(child.node, {}, recursive(child.children));
        }
        return child.node;
      });
    };
    return recursive(hierarchyNodes);
  }

  renderRightTree(newTreeNodes, keys) {
    const { props } = this;

    const trProps = {
      prefixCls: `${props.prefixCls}-rightTreeNode`,
      treeNodeLabelProp: props.treeNodeLabelProp,
      isMultiple: props.multiple || props.tags || props.treeCheckable,
      removeSelected: props.removeSelected,
      locale: props.locale,
      localePack: props.localePack,
      onSelect: this.onSelect,
      keys,
      treeCheckStrictly: props.treeCheckStrictly,
      dropdownWidth: this.state.dropdownWidth,
    };

    const recursive = (children, level) =>
      // Note: if use `React.Children.map`, the node's key will be modified.
      toArray(children).map(function handler(child) { // eslint-disable-line
        if (child && child.props.children && !props.treeCheckStrictly) {
          // null or String has no Prop
          return (
            <RightTreeNode
              {...trProps}
              {...child.props}
              pos={child.key}
              level={level}
              isLeft={false}
              key={child.key}
            >
              {recursive(child.props.children, (level + 1))}
            </RightTreeNode>
          );
        }
        return (
          <RightTreeNode
            {...trProps}
            {...child.props}
            pos={child.key}
            level={level}
            isLeft
            key={child.key}
          />
        );
      });

    return (
      <div
        className={`${trProps.prefixCls}`}
        style={{ height: `${props.dropdownStyle.maxHeight ? props.dropdownStyle.maxHeight - 62 : 250}px` }}
      >
        {recursive(newTreeNodes, 1)}
      </div>
    );
  }

  renderRightDropdown(rightTreeNodes, keys) {
    const {
      resultsPanelAllClearBtn,
      resultsPanelTitle,
      resultsPanelTitleStyle,
      value,
      localePack,
    } = this.props;

    const resultsPanelPrefixCls = `${this.getDropdownPrefixCls()}-right`;

    let renderRightDropdownTitle = null;

    if (resultsPanelTitle) {
      renderRightDropdownTitle = (
        <p className={`${resultsPanelPrefixCls}-title`} style={resultsPanelTitleStyle}>
          {resultsPanelTitle}
        </p>
      );
    }
    const num = value.length || 0;

    const noContent = (<div
      className={`${resultsPanelPrefixCls}-noContent`}
    >
      {localePack.pleaseSelectFromLeft}
    </div>);
    const clear = (<span
      key="rightDropdownAllclear"
      className={`${resultsPanelPrefixCls}-allClear`}
      onClick={this.onResultsPanelAllClear}
    >{localePack.clear}</span>);

    return (
      <div className={`${resultsPanelPrefixCls}`}>
        <div style={{ padding: '16px' }}>
          <div>
            <span className={`${resultsPanelPrefixCls}-selected`}>
              <span className={`${resultsPanelPrefixCls}-selected-title`}>{localePack.alreadyChoosed}</span>
              <span className={`${resultsPanelPrefixCls}-selected-number`}>（{num}）</span>
            </span>
            {resultsPanelAllClearBtn && num ? clear : null}
          </div>
          {renderRightDropdownTitle}
        </div>
        {
          num === 0 ? noContent : this.renderRightTree(rightTreeNodes, keys)
        }
      </div>
    );
  }

  renderTree(keys, halfCheckedKeys, newTreeNodes, multiple) {
    const props = this.props;

    const trProps = {
      multiple,
      prefixCls: `${props.prefixCls}-tree`,
      showIcon: props.treeIcon,
      showLine: props.treeLine,
      defaultExpandAll: props.treeDefaultExpandAll,
      defaultExpandedKeys: props.treeDefaultExpandedKeys,
      filterTreeNode: this.highlightTreeNode,
    };

    if (props.treeCheckable) {
      trProps.selectable = false;
      trProps.checkable = props.treeCheckable;
      trProps.onCheck = props.onSelect;
      trProps.checkStrictly = props.treeCheckStrictly;
      if (props.inputValue) {
        // enable checkStrictly when search tree.
        trProps.checkStrictly = true;
      } else {
        trProps._treeNodesStates = props._treeNodesStates;
      }
      if (trProps.treeCheckStrictly && halfCheckedKeys.length) {
        trProps.checkedKeys = { checked: keys, halfChecked: halfCheckedKeys };
      } else {
        trProps.checkedKeys = keys;
      }
    } else {
      trProps.selectedKeys = keys;
      trProps.onSelect = props.onSelect;
    }

    // expand keys
    if (!trProps.defaultExpandAll && !trProps.defaultExpandedKeys && !props.loadData) {
      trProps.expandedKeys = keys;
    }
    trProps.autoExpandParent = true;
    trProps.onExpand = this.onExpand;
    if (this._expandedKeys && this._expandedKeys.length) {
      trProps.expandedKeys = this._expandedKeys;
    }
    if (this.state.fireOnExpand) {
      trProps.expandedKeys = this.state._expandedKeys;
      trProps.autoExpandParent = false;
    }

    // async loadData
    if (props.loadData) {
      trProps.loadData = props.loadData;
    }

    return (
      <Tree ref={saveRef(this, 'popupEle')} {...trProps}>
        {newTreeNodes}
      </Tree>
    );
  }

  render() {
    const props = this.props;
    const multiple = props.multiple;
    const dropdownPrefixCls = this.getDropdownPrefixCls();
    const popupClassName = {
      [props.dropdownClassName]: !!props.dropdownClassName,
      [`${dropdownPrefixCls}--${multiple ? 'multiple' : 'single'}`]: 1,
    };
    let visible = props.visible;
    const search = multiple || props.combobox || !props.showSearch ? null : (
      <span className={`${dropdownPrefixCls}-search`}>{props.inputElement}</span>
    );

    const recursive = children => {
      // Note: if use `React.Children.map`, the node's key will be modified.
      return toArray(children).map(function handler(child) { // eslint-disable-line
        if (!child) {
          return null;
        }
        if (child && child.props.children) {
          // null or String has no Prop
          return (
            <TreeNode {...child.props} key={child.key}>
              {recursive(child.props.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...child.props} key={child.key} />;
      });
    };
    // const s = Date.now();
    let treeNodes;
    if (props._cachetreeData && this.treeNodes) {
      treeNodes = this.treeNodes;
    } else {
      treeNodes = recursive(props.treeData || props.treeNodes);
      this.treeNodes = treeNodes;
    }
    // console.log(Date.now()-s);

    if (props.inputValue) {
      treeNodes = this.processTreeNode(treeNodes);
    }

    const rightTreeNodes = props.filterResultsPanel ?
      this.processSelectedTreeNode(treeNodes) :
      this.processSelectedTreeNode(this.treeNodes);

    const keys = [];
    const halfCheckedKeys = [];
    loopAllChildren(treeNodes, (child) => {
      if (props.value.some(item => item.value === getValuePropValue(child))) {
        keys.push(child.key);
      }
      if (props.halfCheckedValues &&
        props.halfCheckedValues.some(item => item.value === getValuePropValue(child))) {
        halfCheckedKeys.push(child.key);
      }
    });

    let notFoundContent;
    if (!treeNodes.length) {
      if (props.notFoundContent) {
        notFoundContent = (
          <span className={`${props.prefixCls}-not-found`}>
            {props.notFoundContent}
          </span>
        );
      } else if (!search) {
        visible = false;
      }
    }
    // when prop multiple is true,show right dropdown
    const popupElement = (
      <div
        style={{ height: `${props.dropdownStyle.maxHeight || 312}px` }}
      >
        <div
          className={`${dropdownPrefixCls}-left`}
          style={multiple ? {} : {
            width: '100%',
          }}
        >
          {search}
          {notFoundContent || this.renderTree(keys, halfCheckedKeys, treeNodes, multiple)}
        </div>
        {multiple && this.renderRightDropdown(rightTreeNodes, keys)}
      </div>
    );

    let popupStyle = {};
    popupStyle['width'] = (props.dropdownMatchSelectWidth || !multiple) ? `${this.state.dropdownWidth}px` : '350px';

    popupStyle = { ...popupStyle, ...props.dropdownStyle };
    return (
      <Trigger
        action={props.disabled ? [] : ['click']}
        ref={saveRef(this, 'trigger')}
        popupPlacement="bottomLeft"
        builtinPlacements={BUILT_IN_PLACEMENTS}
        popupAlign={props.dropdownPopupAlign}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={this.getDropdownTransitionName()}
        onPopupVisibleChange={props.onDropdownVisibleChange}
        popup={popupElement}
        popupVisible={visible}
        getPopupContainer={props.getPopupContainer}
        popupClassName={classnames(popupClassName)}
        popupStyle={popupStyle}
      >
        {this.props.children}
      </Trigger>
    );
  }
}

export default SelectTrigger;
