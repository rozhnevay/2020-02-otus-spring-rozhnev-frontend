<template>
  <a-modal
    :visible="visible"
    title='Добавить Автора'
    okText='Добавить'
    cancelText='Отмена'
    @cancel="() => { $emit('cancel') }"
    @ok="() => { saveAuthor() }"
  >
    <a-form layout='vertical' :form="form">
      <a-form-item label='Автор'>
        <a-input
          v-decorator="[
              'author',
              {
                rules: [{ required: true, message: 'Пожалуйста, введите автора!' }],
              }
            ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
    import axios from "axios";
    export default {
        name: "AuthorForm",
        props: ['visible'],
        beforeCreate() {
          this.form = this.$form.createForm(this, { name: 'form_in_modal' });
        },
        methods: {
          saveAuthor() {
            const form = this.form;
            form.validateFields((err, values) => {
              if (err) {
                return;
              }
              const postData = {name : values.author}

              axios
                .post(`/v1/author`, postData)
                .then(() =>  {
                  this.$emit('loadAuthors')
                  this.$emit('cancel')
                  form.resetFields()
                })
                .catch((err) =>  {
                  alert("Ошибка при добавлении автора")
                  console.log(err)
                })


            });
          }
        }
    }
</script>

<style scoped>

</style>
