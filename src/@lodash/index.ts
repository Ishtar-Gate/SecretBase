import __ from "lodash";

/**
 * You can extend Lodash with mixins
 * And use it as below
 * import _ from '@lodash'
 */
const _ = __.runInContext();

interface LoDashMixins extends _.LoDashStatic {
  setIn<T>(state: T, name: string, value: any): T;
}

_.mixin({
  // Immutable Set for setting state
  setIn: (state: object, name: string, value: any) => {
    return _.setWith(_.clone(state), name, value, _.clone);
  },
});

export default _ as LoDashMixins;
