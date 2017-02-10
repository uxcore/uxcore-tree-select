/**
 * TreeSelect Component for uxcore
 * @author biangang.bg
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */
import RcTreeSelect from './Select';
import assign from 'object-assign';

const supportSVG = document.implementation.hasFeature(
  'http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');

// function filterFn(input, child) {
//   return String(getPropValue(child,
//     labelCompatible(this.props.treeNodeFilterProp))).indexOf(input) > -1;
// }

class TreeSelect extends RcTreeSelect {

}

TreeSelect.displayName = 'TreeSelect';

TreeSelect.defaultProps = assign(RcTreeSelect.defaultProps, {
  prefixCls: 'uxcore-tree-select',
  dropdownClassName: supportSVG ? 'use-svg' : 'no-svg',
  transitionName: 'uxcore-tree-select-dropdown-slide-up',
  choiceTransitionName: 'uxcore-tree-select-selection__choice-zoom',
  showSearch: false,
  dropdownMatchSelectWidth: false,
  maxTagTextLength: 10,
});

TreeSelect.propTypes = RcTreeSelect.propTypes;

module.exports = TreeSelect;
