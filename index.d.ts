// Type definitions for functional-helpers v1.5.0
// Project: functional-helpers
// Definitions by: Anton Strömkvist <http://ahst.ro>

export function renameKeys(x: { [key: string]: string }, y: Object): Object;
export function renameKeys(x: { [key: string]: string }): (y: Object) => Object;
export function compactObj(x: Object): Object;
export function nilOrEmpty(x: any): boolean;
export function evolveAll(x: Object, y: Object): Object;
export function evolveAll(x: Object): (y: Object) => Object;
export function pickDeep(x: string[], y: Object): Object;
export function pickDeep(x: string[]): (y: Object) => Object;
export function pickTree(x: Object, y: Object): Object;
export function pickTree(x: Object): (y: Object) => Object;
export function mergeBy(
  f: (src: Object) => Object,
  g: (src: Object) => Object,
  src: Object
): Object;
export function mergeBy(
  f: (src: Object) => Object,
  g: (src: Object) => Object
): (src: Object) => Object;
export function mergeBy(
  f: (src: Object) => Object
): (g: (src: Object) => Object) => (src: Object) => Object;

export function spread(x: keyof typeof y, y: Object): Object;
export function spread(x: string): (y: Object) => Object;
export function flattenProp(x: keyof typeof y, y: Object): Object;
export function flattenProp(x: string): (y: Object) => Object;
