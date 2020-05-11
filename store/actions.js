import cosmicjs from 'cosmicjs'
import snakeCase from 'lodash.snakecase';
const Cosmic = cosmicjs();

const actions = {
  FETCH_IMAGES: async ({ state, commit}) => {
    const bucket = Cosmic.bucket(state.settings.cosmic);
    const params = {
      type: 'imgix-images',
      sort: '-created_at'
    };
    try {
      const { objects: images } = await bucket.getObjects(params);
      if (images && images.length > 0) {
        commit('SET_IMAGES', images);
      }
    } catch(e) {

    }
  },
  SAVE_IMAGE: async ({state, commit}, payload) => {
    const bucket = Cosmic.bucket(state.settings.cosmic);
    try {
      const media = state.editorModal.media;
      const imgixName = `${payload.name || media.original_name}`;
      const imgixValue = `${media.imgix_url}?${payload.params}`;
      const { object: image } = await bucket.addObject({
        type_slug: 'imgix-images',
        title: media.original_name,
        content: '',
        options: {
          content_editor: false
        },
        metafields: [
          {
            title: 'Original Name',
            key: 'original_name',
            type: 'text',
            value: media.original_name
          },
          {
            title: 'Master Image ID',
            key: 'master_image_id',
            type: 'text',
            value: media.bucket
          },
          {
            title: 'Master Image',
            key: 'master_image',
            type: 'text',
            value: media.imgix_url
          },
          {
            title: 'Optimized Images',
            key: 'optimized_images',
            type: 'parent',
            children: [
              {
                title: snakeCase(imgixName),
                key: snakeCase(imgixName),
                value: imgixValue,
                type: 'text',
              }
            ]
          }
        ],
      });
      commit('ADD_IMAGE', image);
      commit('CLOSE_IMAGE_EDITOR');
    } catch(e) {
    }
  },
  EDIT_IMAGE_OBJECT: async ({state, commit}, payload) => {
    const bucket = Cosmic.bucket(state.settings.cosmic);
    try {
      const media = state.editorModal.media;
      const editImage = state.images[state.editorModal.editIndex];
      const imgixName = `${payload.name || media.original_name}`;
      const imgixValue = `${media.imgix_url}?${payload.params}`;
      const optimized_images = Object.keys(editImage.metadata.optimized_images).map(key => {
        return {
          title: key,
          key,
          value: editImage.metadata.optimized_images[key],
          type: 'text',
        };
      });
      optimized_images.unshift({
        title: snakeCase(imgixName),
        key: snakeCase(imgixName),
        value: imgixValue,
        type: 'text',
      });

      const editObject = {
        slug: editImage.slug,
        options: {
          content_editor: false
        },
        metafields: [
          {
            title: 'Original Name',
            key: 'original_name',
            type: 'text',
            value: editImage.metadata.original_name
          },
          {
            title: 'Master Image ID',
            key: 'master_image_id',
            type: 'text',
            value: editImage.metadata.master_image_id
          },
          {
            title: 'Master Image',
            key: 'master_image',
            type: 'text',
            value: editImage.metadata.master_image
          },
          {
            title: 'Optimized Images',
            name: 'Optimized Images',
            key: 'optimized_images',
            type: 'parent',
            children: optimized_images
          }
        ],
      };

      const { object: image } = await bucket.editObject(editObject);

      commit('EDIT_IMAGE_OBJECT', {
        id: state.editorModal.editIndex,
        image
      });
      window.location = window.location.href;
      commit('CLOSE_IMAGE_EDITOR');

    } catch(e) {
    }
  }
}

export default actions
