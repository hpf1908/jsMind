a mindMap written by javascript , not finished yet

@todo: 

1 . 布局模型 
2 . 样式，包括线条以及形状
3 . 交互（拖拽，双击、导航）

layout

stage
  view
    control
      - editButton
      - line

deps:

raphael 、 seajs 、jquery

针对raphael的调用接口抽象出来做个适配器，以后可以随意替换底层的方法


详细设计思考
------------------------
1、 ui节点和内存节点分离管理
2、 ui节点支持可以自定义
3、 api可以支持节点可以直接操作
