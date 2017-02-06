import React, { PropTypes } from 'react';
import classnames from 'classnames';

export default class RightTreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: !(props.isAll || (this.isSelectNode() && props.children))
    };

    this.expand = this.expand.bind(this);
    this.removeSelected = this.removeSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.isAll !== nextProps.isAll) {
      this.setState({
        expand: !nextProps.isAll
      });
    }
  }

  expand() {
    this.setState({
      expand: !this.state.expand
    });
  }


  removeSelected() {
    const { fireChange, value, model, checkVls, vls } = this.props;

    if (model === 'select') {
      fireChange(vls.filter(item => item.value !== value));
      // todo optimize--隐藏删除 
    } else if (model === 'check') {
      
    }

    // todo 回调

  }

  isSelectNode() {
    const { model, value, checkVls, vls, pos } = this.props;

    if (model === 'select') {
      return vls.map(item => item.value).indexOf(value) > -1;
    } else if (model === 'check') {
      return checkVls.indexOf(pos) > -1;
    }

    return false;
  }

  render() {
    const { value, treeNodeLabelProp, children, isAll, prefixCls, level, removeSelected } = this.props;
    const { expand } = this.state;
    // padding 无箭头 +36  有箭头+18
    const paddingLeftStyle = {};
    if (level > 1) {
      paddingLeftStyle.paddingLeft = !children ? `${16 + level * 18}px` : `${16 + (level - 1) * 18}px`;
    } 
    const arrowCls = {
      [`${prefixCls}-arrow-close`]: !expand,
      [`${prefixCls}-arrow-open`]: expand,
      [`${prefixCls}-arrow-switch`]: true
    }

    return (
      <div>
        <div className={`${prefixCls}-hoverNode`} style={paddingLeftStyle}>
          {
            children ? 
            <span onClick={this.expand} className={classnames(arrowCls)} />
            : null
          }
          {this.props[treeNodeLabelProp]}
          {isAll || (this.isSelectNode() && children) ? <span className={`${prefixCls}-allSelect`}>全选</span> : null}
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

}
