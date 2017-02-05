import React, { PropTypes } from 'react';
import classnames from 'classnames';

export default class RightTreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: !this.props.isAll
    };

    this.expand = this.expand.bind(this);
  }

  expand() {
    this.setState({
      expand: !this.state.expand
    });
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.isAll !== nextProps.isAll) {
      this.setState({
        expand: !nextProps.isAll
      });
    }
  }

  render() {
    const { value, label, key, children, isAll, prefixCls, isLeft, level } = this.props;
    const { expand } = this.state;
    // padding 无箭头 +36  有箭头+18
    const paddingLeftStyle = {};
    if (level > 1) {
      paddingLeftStyle.paddingLeft = isLeft ? `${16 + level * 18}px` : `${16 + (level - 1) * 18}px`;
    } 
    const arrowCls = {
      [`${prefixCls}-arrow-close`]: !expand,
      [`${prefixCls}-arrow-open`]: expand,
      [`${prefixCls}-arrow-switch`]: true
    }

    return (
      <div key={key}>
        <div className={`${prefixCls}-hoverNode`} style={paddingLeftStyle}>
          {
            children ? 
            <span onClick={this.expand} className={classnames(arrowCls)} />
            : null
          }
          {value}
          {isAll ? <span className={`${prefixCls}-allSelect`}>全选</span> : null}
          <span className={`${prefixCls}-clear`}>删除</span>
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
