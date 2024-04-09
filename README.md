## 网页文档本地管理插件

### 本地启动

因为在 chrome extension 环境，所以启动请执行 npm run build 或者 npm run build:watch

### 优化开发中编译速度

buildEntry=page npm run build:watch 仅编译 page 相关文件

使用 antd 组件时，通过 import Input from 'antd/es/input' 导入，提高编译速度。