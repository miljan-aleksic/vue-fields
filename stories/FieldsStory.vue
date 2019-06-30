<template>

    <div class="container">

        <h1>Fields</h1>

        <div class="row">

            <div class="col-md-6">

                <div class="panel panel-default">

                    <div class="panel-heading"><h2 class="panel-title">Custom</h2></div>

                    <Fields v-slot="{field, evaluate}" :config="$options.fields" :values="values" class="panel-body" tag="fieldset" @change="logChange">
                        <Field v-slot="{filterOptions}">

                            <div v-show="evaluate(field.show)" class="form-group">

                                <label v-if="field.type !== 'checkbox'">{{ field.label }}</label>

                                <!-- text -->
                                <template v-if="field.type === 'text'">

                                    <input v-model="field.value" type="text" class="form-control">

                                </template>

                                <!-- textarea -->
                                <template v-if="field.type === 'textarea'">

                                    <textarea v-model="field.value" class="form-control"></textarea>

                                </template>

                                <!-- number -->
                                <template v-if="field.type === 'number'">

                                    <input v-model="field.value" type="number" class="form-control">

                                </template>

                                <!-- checkbox -->
                                <template v-if="field.type === 'checkbox'">

                                    <input v-model="field.value" type="checkbox">

                                </template>

                                <!-- select -->
                                <template v-if="field.type === 'select'">

                                    <select v-model="field.value" class="form-control">
                                        <template v-for="option in filterOptions(field.options || [])">
                                            <optgroup v-if="option.label" :label="option.label" :key="option.label">
                                                <option v-for="opt in option.options" :value="opt.value" :key="opt.value">{{ opt.text }}</option>
                                            </optgroup>
                                            <option v-else :value="option.value" :key="option.label">{{ option.text }}</option>
                                        </template>
                                    </select>

                                </template>

                            </div>

                        </Field>
                    </Fields>

                </div>

            </div>

        </div>

        <pre>{{ values }}</pre>

    </div>

</template>

<script>

    import Field from 'vue-fields/field';
    import Fields from 'vue-fields/fields';

    import {action} from '@storybook/addon-actions';

    export default {

        fields: {

            text: {
                label: 'Text',
                type: 'text'
            },

            textarea: {
                label: 'Textarea',
                type: 'textarea'
            },

            select: {
                label: 'Select',
                type: 'select',
                default: 1,
                options: {
                    one: 1,
                    two: 2,
                    three: 3,
                    Group: {four: 4, five: 5}
                }
            },

            number: {
                label: 'Number',
                type: 'number'
            },

            // // custom: {
            // //     label: 'Custom',
            // //     type: 'custom'
            // // },

            show: {
                type: 'checkbox',
                default: true
            },

            _show: {
                label: 'Show/Hide',
                type: 'text',
                show: 'show == true'
            },

            enable: {
                type: 'checkbox',
                default: true
            },

            _enable: {
                label: 'Enable/Disable',
                type: 'text',
                enable: ({enable}) => enable
            },

            'nested.text': {
                label: 'Nested Text',
                type: 'text'
            }

        },

        components: {
            Field,
            Fields
        },

        data: () => ({
            values: {
                text: 'Text',
                multi: {
                    input: 'Input'
                }
            }
        }),

        methods: {

            logChange(value, {name}) {
                action(`@change (${name})`)(value);
            }

        }

    };

</script>

<style>

@import url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css');

</style>
