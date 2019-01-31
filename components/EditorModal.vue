<template>
  <div>
    <b-modal
      :active="isEditorModal"
      :width="700"
      :can-cancel="canCancel"
      scroll="keep"
      @close="closeModal">
      <div
        v-if="info && media && media.imgix_url"
        class="box">
        <div class="content">
          <h3 class="title is-4">{{ modalTitle }}</h3>
          <div class="image-box">
            <img :src="imageUrl">
          </div>
          <br>
          <b-field
            horizontal
            label="Name">
            <b-input
              v-model="imageName"
              type="text" />
          </b-field>
          <br>
          <h4 class="title is-5">Compression / Performance</h4>
          <div class="columns">
            <div class="column is-half">
              <b-field
                horizontal
                label="Quality">
                <vue-slider
                  v-model="editor.q"
                  :lazy="true"
                  :interval="5" />
              </b-field>
            </div>
            <div class="column is-half">
              <b-field
                horizontal
                label="Auto">
                <multiselect
                  v-model="editor.auto"
                  :multiple="true"
                  :options="editorSettings.auto" />
              </b-field>
            </div>
          </div>
          <br>
          <h4 class="title is-5">Crop / Resize</h4>
          <div class="columns">
            <div class="column is-half">
              <b-field
                horizontal
                label="Width">
                <b-input
                  v-model="editor.w"
                  :max="info.PixelWidth"
                  type="number"
                  min="20"/>
              </b-field>
            </div>
            <div class="column is-half">
              <b-field
                horizontal
                label="Height">
                <b-input
                  v-model="editor.h"
                  :max="info.PixelHeight"
                  min="20"
                  type="number" />
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half">
              <b-field
                horizontal
                label="Fit">
                <multiselect
                  v-model="editor.fit"
                  :options="editorSettings.fit" />
              </b-field>
            </div>
            <div class="column is-half">
              <b-field
                v-if="editor.fit==='crop'"
                horizontal
                label="Crop">
                <multiselect
                  v-model="editor.crop"
                  :multiple="true"
                  :options="editorSettings.crop" />
              </b-field>
            </div>
          </div>
          <br>
          <h4
            v-if="isFaceArea"
            class="title is-5">Faces</h4>
          <div
            v-if="isFaceArea"
            class="columns">
            <div class="column is-half">
              <b-field
                horizontal
                label="FaceIndex">
                <vue-slider
                  v-model="editor.faceindex"
                  :lazy="true"
                  :max="info.Faces.length"/>
              </b-field>
              <b-field
                horizontal
                label="Mask">
                <multiselect
                  v-model="editor.mask"
                  :options="editorSettings.mask" />
              </b-field>
            </div>
            <div class="column is-half">
              <b-field
                horizontal
                label="FacePad">
                <vue-slider
                  v-model="editor.facepad"
                  :lazy="true"
                  :interval="0.1"
                  :max="10"/>
              </b-field>
            </div>
          </div>
          <br>
          <button
            class="button is-info"
            @click="saveImage">Save</button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import vueSlider from 'vue-slider-component';

export default {
  components: {
    Multiselect,
    vueSlider
  },
  data() {
    return {
      editor: {
        w: 400,
        h: 300,
        q: 70,
        auto: null,
        fit: null,
        crop: null,
        faceindex: 0,
        facepad: 0,
        mask: null
      },
      image_name: null,
    }
  },
  computed: {
    editorSettings() {
      return this.$store.state.editorSettings;
    },
    isEditorModal() {
      return this.$store.state.editorModal.open;
    },
    media() {
      return this.$store.state.editorModal.media;
    },
    canCancel() {
      return this.$store.state.editorModal.isEdit ? true : false;
    },
    info() {
      return this.$store.state.editorModal.info;
    },
    isFaceArea() {
      return this.info.Faces && this.info.Faces.length > 0 && this.editor.fit == 'facearea';
    },
    modalTitle() {
      return this.$store.state.editorModal.isEdit ? 'Add Optimized Image' : 'Edit Image';
    },
    imageName: {
      set(value) {
        this.image_name = value;
      },
      get() {
        return this.image_name || this.media.original_name;
      }
    },
    imageUrl() {
      if(this.media) {
        const params = this.getParams(this.editor);
        return `${this.media.imgix_url}?${params}`;
      }
      return '';
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
  },
  methods: {
    getParams(params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val == null || val == 0) {
          delete params[key]
        }
      });
      return Object.entries(params).map(e => e.join('=')).join('&');
    },
    closeModal() {
      this.$store.commit('CLOSE_IMAGE_EDITOR');
    },
    async saveImage() {
      if (!this.$store.state.editorModal.isEdit) {
        const params = this.getParams(this.editor);
        await this.$store.dispatch('SAVE_IMAGE', {
          name: this.image_name,
          params
        });
      } else {
        const params = this.getParams(this.editor);
        await this.$store.dispatch('EDIT_IMAGE_OBJECT', {
          name: this.image_name,
          params
        });
      }
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.image-box {
  background: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.25, rgba(255, 255, 255, 0.06)), color-stop(0.25, rgba(0, 0, 0, 0.06))), -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.25, rgba(255, 255, 255, 0.06)), color-stop(0.25, rgba(0, 0, 0, 0.06))), -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.75, rgba(0, 0, 0, 0.06)), color-stop(0.75, rgba(255, 255, 255, 0.06))), -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.75, rgba(0, 0, 0, 0.06)), color-stop(0.75, rgba(255, 255, 255, 0.06)));
  padding: 3em;
  text-align: center;
  height: 300px;
  background-position: 0 0, 8px 0, 8px -8px, 0 8px;
  background-size: 16px 16px;
}
.image-box img {
  background: #333;
  max-width: 100%;
  max-height: 100%;
}
.field >>> .field-label {
  text-align: left;
}
.multiselect >>> .multiselect__content {
  margin: 0;
}
.multiselect >>> .multiselect__content-wrapper {
  z-index: 99;
}
.multiselect.multiselect--active {
  z-index: 99;
}
</style>

