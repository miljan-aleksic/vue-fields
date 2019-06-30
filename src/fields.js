import {assign, each, set, get, parse, isArray, isString, isFunction, isUndefined, warn} from './util';

export default {

    provide() {
        return {Fields: this};
    },

    props: {

        config: {
            type: [Object, Array],
            default: () => ({})
        },

        values: {
            type: Object,
            default: () => ({})
        },

        tag: {
            type: String,
            default: 'div'
        }

    },

    methods: {

        prepare(config) {

            const fields = [];
            const arr = isArray(config);

            each(config, (field, key) => {

                field = assign({}, field);

                if (!field.name && !arr) {
                    field.name = key;
                }

                if (!field.name) {
                    warn(`Field name missing ${JSON.stringify(field)}`);
                    return;
                }

                fields.push(field);

            });

            return fields;
        },

        evaluate(expression, values = this.values) {

            try {

                if (isUndefined(expression)) {
                    return true;
                }

                if (isString(expression)) {
                    expression = parse(expression);
                }

                if (isFunction(expression)) {
                    return expression.call(this, values, {$match, $get: key => get(values, key)});
                }

                return expression;

            } catch (e) {
                warn(e);
            }

            return true;
        }

    },

    render (h) {

        const fields = this.prepare(this.config, this.prefix);

        if (!this.$scopedSlots.default) {
            warn('Default Fields slot is missing');
            return;
        }

        return h(this.tag, fields.map(field => {

            const obj = {
                field,
                evaluate: this.evaluate
            };

            Object.defineProperty(field, 'value', {

                get: () => {
                    return get(this.values, field.name);
                },

                set: value => {

                    set(this.values, field.name, value);

                    this.$emit('change', value, field);

                }

            });

            return this.$scopedSlots.default(obj);

        }));

    }

};

function $match(subject, pattern, flags) {
    return subject && (new RegExp(pattern, flags).test(subject));
}
