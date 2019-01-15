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
    <b-modal
      :active="isModal"
      :width="640"
      :can-cancel="false"
      scroll="keep">
      <div class="box">
        <div class="content">
          <h3 class="title is-4">Edit Image</h3>
          <div class="image-box">
            <img :src="imageUrl">
          </div>
          <br>
          <div class="columns">
            <div class="column">Width</div>
            <div class="column is-four-fifths">
              <vue-slider
                v-if="imgix_data"
                v-model="editor.w"
                :tooltip="false"
                :min="24"
                :max="imgix_data.PixelWidth"/>
            </div>
          </div>
          <div class="columns">
            <div class="column">Height</div>
            <div class="column is-four-fifths">
              <vue-slider
                v-if="imgix_data"
                v-model="editor.h"
                :tooltip="false"
                :min="24"
                :max="imgix_data.PixelHeight"/>
            </div>
          </div>
          <div class="columns">
            <div class="column">Output Quality</div>
            <div class="column is-four-fifths">
              <vue-slider
                v-if="imgix_data"
                v-model="editor.q"
                :tooltip="false"/>
            </div>
          </div>
          <button
            class="button is-info"
            @click="saveImage">Save</button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component';
import axios from 'axios';
import cosmicjs from 'cosmicjs';

const Cosmic = cosmicjs();
export default {
  components: {
    vueSlider
  },
  data() {
    return {
      isNotify: false,
      isSuccess: false,
      isUploadOpen: false,
      uploadFile: null,
      uploading: false,
      isModal: false,
      media: null,
      imgix_data: null,
      editor: {
        w: 400,
        h: 300,
        q: 75,
      },
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
    imageUrl() {
      if(this.media) {
        const params = Object.entries(this.editor).map(e => e.join('=')).join('&');
        return `${this.media.imgix_url}?${params}`;
      }
      return '';
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
        this.media = media;
        const {data: imgix_data} = await axios.get(`${this.media.imgix_url}?faces=1&fm=json`);
        this.imgix_data = imgix_data;
        this.isModal = true;
      } catch(e) {
        this.isSuccess = false;
        this.isNotify = true;
      }
      this.uploadFile = null;
      this.isUploadOpen = false;
      this.uploading = false;
    },
    async saveImage() {
      this.uploading = true;
      const bucket = Cosmic.bucket(this.$store.state.settings.cosmic);
      try {
        const params = Object.entries(this.editor).map(e => e.join('=')).join('&');
        const { object: image } = await bucket.addObject({
          type_slug: 'imgix-image',
          title: this.media.original_name,
          content: '',
          options: {
            content_editor: false
          },
          metafields: [
            {
              key: 'master_image_id',
              type: 'text',
              value: this.media.bucket
            },
            {
              key: 'master_image',
              type: 'text',
              value: this.media.imgix_url
            },
            {
              key: 'optimized_image',
              type: 'text',
              value: `${this.media.imgix_url}?${params}`
            }
          ],
        });
        this.$store.commit('ADD_IMAGE', image);
        this.isSuccess = true;
      } catch(e) {
        this.isSuccess = false;
      }
      this.isModal = false;
      this.isNotify = true;
      this.uploading = false;
      this.media = null;
      this.imgix_data = null;
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
.image-box {
  background: #333;
  padding: 3em;
  text-align: center;
  height: 400px;
}
.image-box img {
  max-width: 100%;
  max-height: 100%;
}
</style>
