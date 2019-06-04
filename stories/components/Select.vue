<template>

    <select v-model="field.value" class="form-control">
        <template v-for="option in Fields.filterOptions(field.options || [])">
            <optgroup v-if="option.label" :label="option.label" :key="option.label">
                <option v-for="opt in option.options" :value="opt.value" :key="opt.value">{{ opt.text }}</option>
            </optgroup>
            <option v-else :value="option.value" :key="option.label">{{ option.text }}</option>
        </template>
    </select>

</template>

<script>

    export default {

        props: ['field'],

        inject: ['Fields']

    };

</script>