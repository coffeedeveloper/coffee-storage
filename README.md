# 一个建议的localStorage的辅助库

## 注意点

使用了库管理localStorage的某项item后，请勿再手动用localStorage的api去修改，必须用库去修改，否则会产生不可预料的结果。

## API说明

### 初始化
```js
//key为是在localStorage中的item的名称
var storage = new Storage('key');
//如果需要版本管理
var storage = new Storage({
  key: 'key',
  version: '1.1', //每当版本号变更的时候，会清空原有内容
  autoSave: true, //是否自动保存，自动保存的话，在使用了set之后就自动保存
});
```

### `set`设置属性的值
```js
storage.set('x', 1);
```

### `get`获取属性的值
```js
storage.get('x'); //1
```

### `has`判断是否有这个属性
```js
storage.has('x'); //true
```

### `del`删除值
```js
storage.del('x');
```

### `save`保存
```js
//默认会自动保存
storage.save();
```

### `clear`清空所有值
```js
storage.clear();
```
