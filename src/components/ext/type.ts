import { FieldRule } from '@arco-design/web-vue';

export type ExtFromType =
  | 'input'
  | 'checkbox'
  | 'number'
  | 'select'
  | 'date'
  | 'autoComplete'
  | 'treeSelect'
  | 'textArea'
  | 'departSelect'
  | 'custom'
  | 'switch'
  | 'userSelect';

export type ExtSunFromType = ExtFromType & 'del';

export type ExtFormFieldItem<T = any> = {
  label: string;
  prop: string;
  type?: ExtFromType;
  slotName?: string;
  rules?: FieldRule[];
  fieldCopmProps?: T;
  render?: ({
    row,
    value,
    change,
  }: {
    row: Record<string, any>;
    value: any;
    change: (e: any) => void;
  }) => any;
};

export type ExtSubformFieldItem<T = any> = ExtFormFieldItem<T> & {
  width?: number | undefined;
  disabled?: (row: Record<string, any>) => boolean;
};
