<template>
  <div>
    <div
      v-if="isNotify"
      class="columns">
      <div class="column is-half is-offset-one-quarter">
        <b-notification
          :active.sync="isNotify"
          :type="notify.type">
          {{ notify.message }}
        </b-notification>
      </div>
    </div>
    <div class="columns">
      <div class="column is-12">
        <div class="is-pulled-left">
          <h3 class="title is-3">Images</h3>
        </div>
        <div class="is-pulled-right">
          <button
            v-if="!ImagesEmpty"
            class="button is-info"
            @click="isUploadOpen = !isUploadOpen">{{ uploadButtonText }}</button>
        </div>
      </div>
    </div>
    <b-collapse :open="!isLoading && (isUploadOpen || ImagesEmpty)">
      <b-loading
        :is-full-page="false"
        :active="uploading" />
      <div v-if="uploadFile && uploadFile.length > 0">
        <p class="sub-title">{{ uploadFile[0].name }}</p>
      </div>
      <b-field>
        <b-upload
          v-model="uploadFile"
          :disabled="uploading"
          drag-drop
          accept="image/*"
          @input="uploadFileChange">
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon
                  icon="upload"
                  size="is-large" />
              </p>
              <p>Drop your file here or click to upload</p>
            </div>
          </section>
        </b-upload>
      </b-field>
    </b-collapse>
  </div>
</template>

<script>
import axios from 'axios';
import cosmicjs from 'cosmicjs';

const Cosmic = cosmicjs();
export default {
  data() {
    return {
      isNotify: false,
      isSuccess: false,
      isUploadOpen: false,
      uploadFile: null,
      uploading: false
    }
  },
  computed: {
    uploadButtonText() {
      return this.isUploadOpen ? 'Cancel' : 'Upload Image';
    },
    notify() {
      return this.isNotify && this.isSuccess ? {
          type: 'is-success',
          message: 'Image uploaded successfully.'
        } : {
          type: 'is-danger',
          message: 'Error in uploading Image.'
        };
    },
    isLoading() {
      return this.$store.state.loading;
    },
    ImagesEmpty() {
      return this.$store.state.images.length == 0;
    }
  },
  methods: {
    async uploadFileChange() {
      this.uploading = true;
      const bucket = Cosmic.bucket(this.$store.state.settings.cosmic);
      try{
        const { media } = await bucket.addMedia({ media: this.uploadFile[0] });
        const {data: info} = await axios.get(`${media.imgix_url}?faces=1&fm=json`);
        this.$store.commit('OPEN_IMAGE_EDITOR', {
          isEdit: false,
          media,
          info
        });
      } catch(e) {
        this.isSuccess = false;
        this.isNotify = true;
      }
      this.uploadFile = null;
      this.isUploadOpen = false;
      this.uploading = false;
    }
  }
};
</script>
<style scoped>
.button {
  margin-bottom: 0;
}
.upload >>> .upload-draggable {
  display: block;
}
</style>
