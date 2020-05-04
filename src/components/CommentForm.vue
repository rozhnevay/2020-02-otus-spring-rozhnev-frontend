<template>
  <a-modal
    :visible="visible"
    title='Добавить комментарий'
    okText='Добавить'
    cancelText='Отмена'
    @cancel="() => { $emit('cancel') }"
    @ok="() => { saveComment() }"
  >
    <a-form layout='vertical' :form="form">
      <a-form-item label='Автор'>
        <a-input
          v-decorator="[
              'author',
              {
                rules: [{ required: true, message: 'Пожалуйста, введите название автора!' }],
              }
            ]"
        />
      </a-form-item>
      <a-form-item label='Комментарий'>
        <a-textarea
          v-decorator="[
              'comment',
              {
                rules: [{ required: true, message: 'Пожалуйста, введите комментарий!' }],
              }
            ]"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
    import axios from "axios";
    export default {
        name: "CommentForm",
        props: ['visible', 'id'],
        beforeCreate() {
          this.form = this.$form.createForm(this, { name: 'form_in_modal' });
        },
        methods: {
          saveComment() {
            const form = this.form;
            form.validateFields((err, values) => {
              if (err) {
                return;
              }
              const postData = {author : values.author, comment: values.comment}

              axios
                .post(`/v1/book/${this.id}/comment`, postData)
                .then(() =>  {
                  this.$emit('loadComments')
                  this.$emit('cancel')
                  form.resetFields()
                })
                .catch((err) =>  {
                  alert("Ошибка при добавлении комментария")
                  console.log(err)
                })


            });
          }
        }
    }
</script>

<style scoped>

</style>
