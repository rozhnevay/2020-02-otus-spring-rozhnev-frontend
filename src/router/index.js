import Vue from 'vue'
import Router from 'vue-router'
import BookList from "@/components/BookList";
import NotFound from "@/components/NotFound";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/books",
      name: 'books',
      component: BookList
    },
    { path: '/', redirect: '/books' },
    { path: '/404', component: NotFound },
    { path: '*', redirect: '/404' },

  ]
})
