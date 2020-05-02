<template>
  <div class="books">
    <div class="button">
      <a-button type="primary" @click="toggleModal">
        + Добавить книгу
      </a-button>
    </div>
    <a-table :columns="columns" :data-source="rows" v-if="rows"
             :customRow="customRow"
             :row-selection="{type:'radio', selectedRowKeys : selectedRowKeys}"
             :pagination="pagination"
             @change="handleTableChange"
    >
      <span slot="name">Название книги</span>
      <span slot="author">Автор</span>
      <span slot="genreSet" slot-scope="genreSet">
        <a-tag
          v-for="genre in genreSet"
          :key="genre.id"
          :color="genre === 'Повесть' ? 'volcano' : genre.length > 5 ? 'geekblue' : 'green'"
        >
          {{ genre.name }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="id">
        <a @click="deleteBook(id)">Удалить</a>
      </span>
    </a-table>
    <a-empty v-else />
    <book-form
      ref="bookForm"
      :visible="visible"
      :authors="authors"
      :genres="genres"
      @cancel="toggleModal"
      @loadBooks="loadBooks"
      @loadAuthors="loadAuthors"
      @loadGenres="loadGenres"
    />
    <div class="comments">
      <a-button type="primary" @click="toggleModalCommentForm" v-if="selectedRowKeys[0]">
        + Добавить комментарий
      </a-button>
      <book-comments :comments="comments"/>
    </div>
    <comment-form
      ref="commentForm"
      :visible="visibleCommentForm"
      :id="selectedRowKeys[0]"
      @cancel="toggleModalCommentForm"
      @loadComments="loadComments"
    />

  </div>
</template>

<script>
  import axios from "axios";
  import BookForm from '@/components/BookForm'
  import CommentForm from '@/components/CommentForm'
  import BookComments from "./BookComments";

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      slots: { title: 'name' },
    },
    {
      dataIndex: 'author.name',
      key: 'author',
      sorter: true,
      slots: { title: 'author' }
    },
    {
      title: 'Жанры',
      key: 'genreSet',
      dataIndex: 'genreSet',
      slots: { title: 'genreSet' },
      scopedSlots: { customRender: 'genreSet' },
    },
    {
      title: 'Действие',
      key: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ];


  export default {
        name: "BookList",
        components: {BookComments, BookForm, CommentForm},
        data() {
          return {
            rows : [],
            columns,
            visible: false,
            visibleCommentForm : false,
            authors : [],
            genres: [],
            selectedRowKeys: [],
            comments: [],
            sorter : {},
            pagination: {
              total: 0,
              pageSize: 5,
              current: 1,
            }
          };
        },
        beforeMount() {

          /* Загружаем книги */
          this.loadBooks();

          /* Список авторов */
          this.loadAuthors();

          /* Список жанров */
          this.loadGenres()
        },
        methods: {
          handleTableChange(pagination, filters, sorter) {
            console.log(pagination, filters, sorter);
            this.pagination = pagination;
            this.sorter = sorter;
            this.loadBooks()
            this.comments = []
          },
          loadGenres() {
            axios
              .get('/v1/genre')
              .then(response =>  this.genres = response.data)
          },
          loadAuthors() {
            axios
              .get('/v1/author')
              .then(response =>  {
                this.authors = response.data
              })
          },
          loadBooks() {
            let sorter = this.sorter && this.sorter.field && this.sorter.order ? `&sort=${this.sorter.field}:${this.sorter.order}` : ""
            axios
              .get(`/v1/book?pageNum=${this.pagination.current - 1}&pageSize=${this.pagination.pageSize}${sorter}`)
              .then(response => {
                this.pagination.total = response.data.totalElements
                response.data.content.forEach(item => item.key = item.id)
                this.rows = response.data.content
                if (this.rows[0]) {
                  this.selectedRowKeys = []
                  this.selectedRowKeys.push(this.rows[0].id)
                  this.loadComments();
                }
              })
          },
          loadComments() {
            if (this.selectedRowKeys.length > 0){
              axios
                .get(`/v1/book/${this.selectedRowKeys[0]}/comment`)
                .then(response => {
                  this.comments = response.data
                })
                .catch(() => this.comments = [])
            } else {
              this.comments = []
            }

          },
          toggleModal() {
            this.visible = !this.visible;
          },
          toggleModalCommentForm() {
            this.visibleCommentForm = !this.visibleCommentForm;
          },
          customRow(record) {
            return {
              on: {
                click: () => {
                  this.selectedRowKeys = []
                  this.selectedRowKeys.push(record.id)
                  this.loadComments();
                }
              }
            };
          },
          deleteBook(element) {
            axios
              .delete(`/v1/book/${element.id}`)
              .then(() => {
                this.selectedRowKeys = [];
                this.loadBooks()
                this.loadComments();
              })
          }
        },
  }
</script>

<style>
  .button {
    text-align: left;
    margin: 1rem;
  }
  .ant-pagination {
    float: none!important;
  }

  .comments {
    width: 50%;
    margin: 0 auto;
    text-align: left;
  }
</style>

