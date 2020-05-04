<template>
  <a-modal
    :visible="visible"
    title='Добавить Жанр'
    okText='Добавить'
    cancelText='Отмена'
    @cancel="() => { $emit('cancel') }"
    @ok="() => { saveGenre() }"
  >
    <a-form layout='vertical' :form="form">
      <a-form-item label='Жанр'>
        <a-input
          v-decorator="[
              'genre',
              {
                rules: [{ required: true, message: 'Пожалуйста, введите жанр!' }],
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
        name: "GenreForm",
        props: ['visible'],
        beforeCreate() {
          this.form = this.$form.createForm(this, { name: 'form_in_modal' });
        },
        methods: {
          saveGenre() {
            const form = this.form;
            form.validateFields((err, values) => {
              if (err) {
                return;
              }
              const postData = {name : values.genre}

              axios
                .post(`/v1/genre`, postData)
                .then(() =>  {
                  this.$emit('loadGenres')
                  this.$emit('cancel')
                  form.resetFields()
                })
                .catch((err) =>  {
                  alert("Ошибка при добавлении жанра")
                  console.log(err)
                })


            });
          }
        }
    }
</script>

<style scoped>

</style>
