<template>
  <div>
    <a-menu mode="horizontal">
      <a-menu-item key="books" @click="$router.push('books')"> <a-icon type="appstore" />Книги</a-menu-item>
      <a-menu-item key="about" @click="$router.push('about')"> <a-icon type="mail" />О приложении</a-menu-item>
    </a-menu>
  </div>
</template>

<script>
    export default {
        name: "PageHeader"
    }
</script>

<style scoped>

</style>
