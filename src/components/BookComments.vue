<template>
  <div>
    <a-comment class="comment" v-for="item in comments" :key="item.id">
      <a slot="author">{{item.author}}</a>
      <a-avatar
        slot="avatar"
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="Han Solo"
      />
      <p slot="content">
        {{item.comment}}
      </p>
      <a-tooltip slot="datetime" :title="moment().format('YYYY-MM-DD HH:mm:ss')">
        <span>{{ moment(item.createdDate).fromNow() }}</span>
      </a-tooltip>
    </a-comment>
  </div>
</template>

<script>
  import axios from "axios";
  import moment from "moment";
    export default {
        name: "BookComments",
        props: ['comments'],
        data() {
          return {
            moment,
          };
        },
        methods: {

        },
    }
</script>

<style scoped>
  .comment {

  }
</style>
