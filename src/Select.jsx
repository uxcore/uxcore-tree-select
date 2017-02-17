/**
 * Refactor the Select Component for uxcore
 * @author chenqiu  wb-cq231719@alibaba-inc.com
 */

import React, { PropTypes } from 'react';
import classnames from 'classnames';
import _TreeSelect from 'rc-tree-select';
import assign from 'object-assign';
import {
  getValuePropValue, isMultipleOrTags, isMultipleOrTagsOrCombobox,
  getTreeNodesStates, flatToHierarchy,
} from 'rc-tree-select/lib/util';
import SelectTrigger from './SelectTrigger';

export default class Select extends _TreeSelect {
  constructor(props) {
    super(props);
    this.onClearInputValue = this.onClearInputValue.bind(this);
    this.onAllClear = this.onAllClear.bind(this);
    this.onRemoveChecked = this.onRemoveChecked.bind(this);
  }

  onAllClear() {
    const props = this.props;

    if (props.treeCheckable && !!!props.treeCheckStrictly) {
      this._treeNodesStates = getTreeNodesStates( // eslint-disable-line
        this.renderedTreeData || props.children,
        []
      );
    }
    // trigger in componentWillReceiveProps
    // this._cacheTreeNodesStates is needed?
    this._checkedNodes = []; // eslint-disable-line
    this._cacheTreeNodesStates = false; // eslint-disable-line

    this.fireChange([]);
  }

  onClearInputValue() {
    if (this.props.inputValue === null) {
      this.setState({
        inputValue: '',
      });
    }
  }

  onRemoveChecked(selectedKeys, info) {
    const item = info.node;
    let value = this.state.value;
    const props = this.props;
    const selectedValue = getValuePropValue(item);
    const selectedLabel = this.getLabelFromNode(item);
    let event = selectedValue;
    if (this.isLabelInValue()) {
      event = {
        value: event,
        label: selectedLabel,
      };
    }
    props.onSelect(event, item, info); // todo
    const checkEvt = info.event === 'check';
      // 多选 unchecked
    if (checkEvt) {
      value = this.getCheckedNodes(info, props).map(n =>
        ({
          value: getValuePropValue(n),
          label: this.getLabelFromNode(n),
        })
      );
    }

    const extraInfo = {
      triggerValue: selectedValue,
      triggerNode: item,
    };
    if (checkEvt) {
      extraInfo.checked = info.checked;
      extraInfo.allCheckedNodes = props.treeCheckStrictly || this.state.inputValue ?
        info.checkedNodes : flatToHierarchy(info.checkedNodesPositions);
      this._checkedNodes = info.checkedNodesPositions; // eslint-disable-line
      // this._treeNodesStates = _tree.checkKeys; // todo 更新_treeNodeState
      this._treeNodesStates = getTreeNodesStates( // eslint-disable-line
        this.renderedTreeData || props.children,
        value.map(itemV => itemV.value)
      );
    }

    this.fireChange(value, extraInfo);
    if (props.inputValue === null) {
      this.setState({
        inputValue: '',
      });
    }
  }

  getInputElement() {
    const props = this.props;
    return (<span className={`${props.prefixCls}-search__field__wrap`}>
      <input
        ref={this.saveInputRef}
        onBlur={this.onInputBlur}
        onChange={this.onInputChange}
        onKeyDown={this.onInputKeyDown}
        value={this.state.inputValue}
        disabled={props.disabled}
        className={`${props.prefixCls}-search__field`}
        role="textbox"
      />
      {
        isMultipleOrTags(props) ? null :
          <i
            className={classnames('kuma-icon kuma-icon-search',
              `${props.prefixCls}-search_icon`)}
          />
      }
      {isMultipleOrTags(props) ? null : this.getSearchPlaceholderElement(!!this.state.inputValue)}
    </span>);
  }

  render() {
    const props = this.props;
    const multiple = isMultipleOrTags(props);
    const state = this.state;
    const { className, disabled, allowClear, prefixCls } = props;
    const ctrlNode = this.renderTopControlNode();
    let extraSelectionProps = {};
    if (!isMultipleOrTagsOrCombobox(props)) {
      extraSelectionProps = {
        onKeyDown: this.onKeyDown,
        tabIndex: 0,
      };
    }
    const rootCls = {
      [className]: !!className,
      [prefixCls]: 1,
      [`${prefixCls}-open`]: state.open,
      [`${prefixCls}-focused`]: state.open || state.focused,
      // [`${prefixCls}-combobox`]: isCombobox(props),
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
    };

    const clear = (<span
      key="clear"
      className={`${prefixCls}-selection__clear`}
      onClick={this.onClearSelection}
    />);
    return (
      <SelectTrigger
        {...props}
        treeNodes={props.children}
        treeData={this.renderedTreeData}
        _cachetreeData={this._cachetreeData} // eslint-disable-line
        _treeNodesStates={this._treeNodesStates} // eslint-disable-line
        halfCheckedValues={this.halfCheckedValues}
        multiple={multiple}
        disabled={disabled}
        visible={state.open}
        inputValue={state.inputValue}
        inputElement={this.getInputElement()}
        value={state.value}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        getPopupContainer={props.getPopupContainer}
        onSelect={this.onSelect}
        onAllClear={this.onAllClear}
        onFireChange={this.fireChange}
        onClearInputValue={this.onClearInputValue}
        onRemoveChecked={this.onRemoveChecked}
        ref="trigger"
      >
        <span
          style={props.style}
          onClick={props.onClick}
          onBlur={this.onOuterBlur}
          onFocus={this.onOuterFocus}
          className={classnames(rootCls)}
        >
          <span
            ref="selection"
            key="selection"
            className={`${prefixCls}-selection
            ${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`}
            role="combobox"
            aria-autocomplete="list"
            aria-haspopup="true"
            aria-expanded={state.open}
            {...extraSelectionProps}
          >
          {ctrlNode}
          {allowClear && !multiple && this.state.value.length &&
          this.state.value[0].value ? clear : null}
            {multiple || !props.showArrow ? null :
              (<span
                key="arrow"
                className={`${prefixCls}-arrow`}
                style={{ outline: 'none' }}
              >
                <b />
              </span>)}
            {multiple ?
              this.getSearchPlaceholderElement(!!this.state.inputValue || this.state.value.length) :
              null}
          </span>
        </span>
      </SelectTrigger>
    );
  }
}

Select.defaultProps = assign({}, _TreeSelect.defaultProps, {
  resultsPanelAllClearBtn: true,
  resultsPanelTitle: '',
  resultsPanelTitleStyle: {},
  filterResultsPanel: true,
});

Select.propTypes = assign({}, _TreeSelect.propTypes, {
  resultsPanelAllClearBtn: PropTypes.bool,
  resultsPanelTitle: PropTypes.any,
  resultsPanelTitleStyle: PropTypes.object,
  filterResultsPanel: PropTypes.bool,
});

