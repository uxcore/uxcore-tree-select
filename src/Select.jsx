import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import _TreeSelect from 'rc-tree-select';
import SelectTrigger from './SelectTrigger';
import assign from 'object-assign';
import {
  getPropValue, getValuePropValue, /* isCombobox,*/
  isMultipleOrTags, isMultipleOrTagsOrCombobox,
  isSingleMode, toArray,
  UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE,
  preventDefaultEvent,
  getTreeNodesStates, flatToHierarchy, filterParentPosition,
  isInclude, labelCompatible, loopAllChildren, filterAllCheckedData,
  processSimpleTreeData,
} from '../node_modules/rc-tree-select/lib/util';


export default class Select extends _TreeSelect {
  static defaultProps = assign(_TreeSelect.defaultProps, {
    rightDropdownAllClearBtn: true,
    rightDropdownTitle: 'test Title',

  })

  constructor(props) {
    super(props);
  }

  onAllclean() {
    this.setState({
      value: []
    })
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
      <SelectTrigger {...props}
        treeNodes={props.children}
        treeData={this.renderedTreeData}
        _cachetreeData={this._cachetreeData}
        _treeNodesStates={this._treeNodesStates}
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
        allClear={this.onAllclean.bind(this)}
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
              <b/>
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
