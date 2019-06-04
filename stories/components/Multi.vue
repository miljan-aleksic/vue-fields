<template>

    <div>

        <input v-model="input" type="text" class="form-control">
        <input v-model="input2" type="text" class="form-control">

    </div>

</template>

<script>

    import {assign} from 'vue-fields/util';

    export default {

        props: ['field'],

        data: () => ({
            input: '',
            input2: ''
        }),

        created() {

            assign(this.$data, this.field.value || {});

            this.$watch('$data', () => {
                this.field.value = this.$data;
            }, {deep: true});

        }

    };

</script>
