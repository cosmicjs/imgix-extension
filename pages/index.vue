<template>
  <div>
    <upload-image />
    <images-table v-if="!isLoading" />
    <editor-modal />
  </div>
</template>

<script>
import UploadImage from '@/components/UploadImage';
import ImagesTable from '@/components/ImagesTable'
import EditorModal from '@/components/EditorModal';

export default {
  name: 'HomePage',
  components: {
    UploadImage,
    ImagesTable,
    EditorModal
  },
  computed: {
    isLoading() {
      return this.$store.state.loading;
    }
  },
}
</script>
