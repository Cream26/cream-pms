import {
  AutoComplete,
  Checkbox,
  Input,
  Select,
  Textarea,
  TreeSelect,
  Switch,
} from '@arco-design/web-vue';
import DepartSelect from '@/components/depart-select/index.vue';
import { ExtFromType } from './type';
import ExtCustom from './costom/ext-costom.vue';
// 定义组件映射类型
type ComponentMap = {
  checkbox: typeof Checkbox;
  input: typeof Input;
  select: typeof Select;
  autoComplete: typeof AutoComplete;
  switch: typeof Switch;
};

// 使用类型映射让函数返回值类型与传入的type参数关联
export default function getRenderComp<T extends ExtFromType | undefined>(
  type?: T
): T extends keyof ComponentMap ? ComponentMap[T] : typeof Input {
  switch (type) {
    case 'checkbox':
      return Checkbox as any;
    case 'switch':
      return Switch as any;
    case 'input':
      return Input as any;
    case 'select':
      return Select as any;
    case 'autoComplete':
      return AutoComplete as any;
    case 'treeSelect':
      return TreeSelect as any;
    case 'textArea':
      return Textarea as any;
    case 'departSelect':
      return DepartSelect as any;
    case 'custom':
      return ExtCustom as any;
    default:
      return Input as any;
  }
}
