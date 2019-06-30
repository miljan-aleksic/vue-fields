import {each, isArray, isObject} from './util';

export default {

    functional: true,

    render(h, {data}) {

        if (data.scopedSlots.default) {

            return data.scopedSlots.default({filterOptions});

        }

    }

};

function filterOptions(options) {

    const opts = [];

    if (isArray(options)) {
        return options;
    }

    each(options, (value, name) => {
        if (isObject(value)) {
            opts.push({label: name, options: filterOptions(value)});
        } else {
            opts.push({text: name, value: value});
        }
    });

    return opts;

}