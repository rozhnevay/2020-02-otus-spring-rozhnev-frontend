<template>
  <div>
    <a-modal
      :visible="visible"
      title='Добавить книгу'
      okText='Добавить'
      cancelText='Отмена'
      @cancel="() => { $emit('cancel') }"
      @ok="() => { saveBook() }"
    >
      <a-form layout='vertical' :form="form">
        <a-form-item label='Название'>
          <a-input
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: 'Пожалуйста, введите название книги!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item label='Автор'>
          <a-select
            v-decorator="[
          'author',
          { rules: [{ required: true, message: 'Пожалуйста, выберите автора!' }] },
        ]"
            placeholder="Пожалуйста, выберите автора"
          >
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0;" />
              <div
                style="padding: 4px 8px; cursor: pointer;"
                @mousedown="e => e.preventDefault()"
                @click="addAuthor"
              >
                <a-icon type="plus" /> Добавить автора
              </div>
            </div>
            <a-select-option v-for="author in authors" :key="author.id" :value="author.id" :data-value="author">
              {{author.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label='Жанры'>
          <a-select
            v-decorator="[
          'genres',
          { rules: [{ required: true, message: 'Пожалуйста, выберите жанр!' }] },
        ]"
            mode="multiple"
            placeholder="Пожалуйста, выберите жанры"
          >
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0;" />
              <div
                style="padding: 4px 8px; cursor: pointer;"
                @mousedown="e => e.preventDefault()"
                @click="addGenre"
              >
                <a-icon type="plus" /> Добавить жанр
              </div>
            </div>
            <a-select-option v-for="genre in genres" :key="genre.id" :value="genre.id">
              {{genre.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <author-form
      ref="authorForm"
      :visible="visibleAuthorForm"
      @cancel="toggleModalAuthorForm"
      @loadAuthors="loadAuthors"
    />
    <genre-form
      ref="genreForm"
      :visible="visibleGenreForm"
      @cancel="toggleModalGenreForm"
      @loadGenres="loadGenres"
    />
  </div>

</template>

<script>
    import axios from "axios";
    import AuthorForm from "./AuthorForm";
    import GenreForm from "./GenreForm";
    export default {
        name: "BookForm",
        components : {
          VNodes: {
            functional: true,
            render: (h, ctx) => ctx.props.vnodes,
          },
          AuthorForm,
          GenreForm
        },
        data() {
          return {
            visibleAuthorForm : false,
            visibleGenreForm : false,
          };
        },
        props: ['visible', 'authors', 'genres'],
        beforeCreate() {
          this.form = this.$form.createForm(this, { name: 'form_in_modal' });
        },
        methods: {
          saveBook() {
            const form = this.form;
            form.validateFields((err, values) => {
              if (err) {
                return;
              }
              const postData = {name: values.name, author: {id : values.author}, genreSet : values.genres.map(g => {return {id: g}})}

              axios
                .post('/v1/book', postData)
                .then(() =>  {
                  this.$emit('loadBooks')
                  this.$emit('cancel')
                  form.resetFields()
                })
                .catch((err) =>  {
                  alert("Ошибка при добавлении книги")
                  console.log(err)
                })
            });
          },
          addAuthor() {
            this.toggleModalAuthorForm();
          },
          addGenre() {
            this.toggleModalGenreForm();
          },
          toggleModalGenreForm() {
            this.visibleGenreForm = !this.visibleGenreForm;
          },
          toggleModalAuthorForm() {
            this.visibleAuthorForm = !this.visibleAuthorForm;
          },
          loadAuthors() {
            this.$emit('loadAuthors')
          },
          loadGenres() {
            this.$emit('loadGenres')
          }
        }
    }
</script>

<style scoped>

</style>
