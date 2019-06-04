/**
 * Install plugin.
 */

import Fields from './fields';
import Util, {log} from './util';

const Plugin = {

    Fields,

    install(Vue) {

        if (this.installed) {
            return;
        }

        Util(Vue);
        log(this.version);

        Vue.component('fields', Fields);
    },

    version: '__VERSION__'
};

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Plugin);
}

export default Plugin;