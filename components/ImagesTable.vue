<template>
  <div class="images-container">
    <b-table
      v-if="images && images.length > 0"
      ref="imgixTable"
      :data="images"
      :opened-detailed="firstIndex"
      detailed
      detail-key="_id"
      @click="toggleDetails">
      <template
        slot-scope="props">
        <b-table-column
          field="title"
          label="Name">
          {{ props.row.title }}
        </b-table-column>
        <b-table-column
          field="created_at"
          label="Date"
          centered>
          <span class="tag is-success">
            {{ new Date(props.row.created_at).toLocaleDateString() }}
          </span>
        </b-table-column>
      </template>
      <template
        slot="detail"
        slot-scope="props">
        <article class="media">
          <figure class="media-left">
            <p class="image is-250">
              <a
                :href="`https://cosmicjs.com/${$store.state.settings.cosmic.slug}/edit-object/${props.row._id}`"
                target="_blank">
                <img
                  :src="`${props.row.metadata.master_image}?w=250`">
              </a>
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>Master Image:</strong>
                <br>
                <span>{{ props.row.metadata.master_image }}</span>
                <span>
                  <b-icon
                    size="is-small"
                    icon="content-copy"
                    class="copy-icon pad"
                    @click.native="handleCopy(props.row.metadata.master_image)" />
                </span>
                <br>
                <br>
                <strong>Optimized Images:</strong>
                <b-table
                  v-if="optimizedImagesLength(props.row.metadata.optimized_images) > 0"
                  :data="optimizedImagesArray(props.row.metadata.optimized_images)">
                  <template
                    slot-scope="props">
                    <b-table-column
                      field="key"
                      label="Key">
                      {{ props.row.key }}
                    </b-table-column>
                    <b-table-column
                      field="url"
                      label="URL">
                      {{ props.row.value }}
                    </b-table-column>
                    <b-table-column
                      field="url"
                      label="Action"
                      centered>
                      <b-icon
                        icon="content-copy"
                        class="copy-icon"
                        @click.native="handleCopy(props.row.value)"/>
                    </b-table-column>
                  </template>
                </b-table>
                <br>
                <button
                  class="button is-info"
                  @click="addImage(props)">Add Image</button>
              </p>
            </div>
          </div>
        </article>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  computed: {
    images() {
      return this.$store.state.images;
    },
    firstIndex() {
      return this.$store.state.images.length > 0 ? [this.$store.state.images[0]._id] : [];
    },
  },
  methods: {
    handleCopy(text) {
      if( this.$clipboard(text)) {
        this.$toast.open({
          message: 'Copied to clipboard!',
          type: 'is-success',
          queue: false
        });
      } else {
        this.$toast.open({
          message: 'Copy not supported. Do manually',
          type: 'is-warning',
          queue: false
        })
      }
    },
    openWindow(id) {
      window.open(`https://cosmicjs.com/${this.$store.state.settings.cosmic.slug}/edit-object/${id}`);
    },
    async addImage(payload) {
      const image = payload.row;
      const {data: info} = await axios.get(`${image.metadata.master_image}?faces=1&fm=json`);
      this.$store.commit('OPEN_IMAGE_EDITOR', {
        editIndex: payload.index,
        isEdit: true,
        media: {
          imgix_url: image.metadata.master_image,
          original_name: image.metadata.original_name
        },
        info
      });
    },
    optimizedImagesLength(images) {
      if (images) {
        return Object.keys(images).length;
      }
      return 0;
    },
    optimizedImagesArray(images) {
      return Object.keys(images).map((key) => {
        return { key, value: images[key] };
      });
    },
    toggleDetails(payload) {
      this.$refs.imgixTable.toggleDetails(payload);
    }
  }
};
</script>

<style scoped>
.image.is-250 {
  width: 250px;
}
.copy-icon.pad {
  padding-left: 5px;
}
.copy-icon:hover {
  cursor: pointer;
}
</style>

