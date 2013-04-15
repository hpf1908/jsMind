a mindMap written by javascript , not finished yet

@todo: 

1. 可编辑创建，编辑面板，创建面板
2. 编辑时支持拖拽
3. 可以撤销
4. 定义描述的数据结构

deps:

raphael 、 seajs 、jquery

针对raphael的调用接口抽象出来做个适配器，以后可以随意替换底层的方法


详细设计思考
------------------------
1、 ui节点和内存节点分离管理
2、 ui节点支持可以自定义
3、 api可以支持节点可以直接操作
