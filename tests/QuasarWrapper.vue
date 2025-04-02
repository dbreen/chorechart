<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>Test App</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <slot></slot>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'QuasarWrapper'
}
</script>
