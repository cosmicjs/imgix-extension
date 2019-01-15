<template>
  <div>
    <upload-image />
    <images-table v-if="!isLoading" />
  </div>
</template>

<script>
import UploadImage from '@/components/UploadImage';
import ImagesTable from '@/components/ImagesTable'

export default {
  name: 'HomePage',
  components: {
    UploadImage,
    ImagesTable
  },
  computed: {
    isLoading() {
      return this.$store.state.loading;
    }
  },
  methods: {
    toggleHelpModal() {
      this.$store.commit('SET_HELP_MODAL', true);
    },
  }
}
</script>
