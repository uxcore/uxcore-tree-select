/**
 * TreeSelect Component for uxcore
 * @author biangang.bg
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */
import RcTreeSelect from './Select';
import assign from 'object-assign';
import TreeNode from 'rc-tree-select/lib/TreeNode';
import strategies from 'rc-tree-select/lib/strategies';


let supportSVG = false;
if (typeof document !== 'undefined') {
  supportSVG = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');
}

class TreeSelect extends RcTreeSelect {}

TreeSelect.TreeNode = TreeNode;
assign(TreeSelect, strategies);
TreeSelect.displayName = 'TreeSelect';

TreeSelect.defaultProps = assign(RcTreeSelect.defaultProps, {
  prefixCls: 'uxcore-tree-select',
  dropdownClassName: supportSVG ? 'use-svg' : 'no-svg',
  transitionName: 'slideUp',
  choiceTransitionName: 'uxcore-tree-select-selection__choice-zoom',
  showSearch: false,
  dropdownMatchSelectWidth: false ,
  maxTagTextLength: 10,
  locale: 'zh-cn',
});

TreeSelect.propTypes = RcTreeSelect.propTypes;


module.exports = TreeSelect;
