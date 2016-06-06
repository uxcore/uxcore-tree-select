/**
 * TreeSelect Component for uxcore
 * @author biangang.bg
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */
import RcTreeSelect from 'rc-tree-select';
import assign from 'object-assign';

let supportSVG = document.implementation.hasFeature(
    "http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
    
function filterFn(input, child) {
    return String(getPropValue(child, labelCompatible(this.props.treeNodeFilterProp))).indexOf(input) > -1;
}

class TreeSelect extends RcTreeSelect {
    
    static displayName = 'TreeSelect'
    
    static defaultProps = assign(RcTreeSelect.defaultProps, {
        prefixCls: 'uxcore-tree-select',
        dropdownClassName: supportSVG ? 'use-svg': 'no-svg',
        transitionName: 'uxcore-tree-select-dropdown-slide-up',
        choiceTransitionName: 'uxcore-tree-select-selection__choice-zoom',
        showSearch: false
    })
    
    static propTypes = RcTreeSelect.propTypes

    constructor(props) {
        super(props);
    }
}

module.exports = TreeSelect;