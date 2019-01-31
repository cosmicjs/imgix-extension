import cosmicjs from 'cosmicjs'
const Cosmic = cosmicjs();

const actions = {
  FETCH_IMAGES: async ({ state, commit}) => {
    const bucket = Cosmic.bucket(state.settings.cosmic);
    const params = {
      type: 'imgix-image',
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
      const { object: image } = await bucket.addObject({
        type_slug: 'imgix-image',
        title: media.original_name,
        content: '',
        options: {
          content_editor: false
        },
        metafields: [
          {
            key: 'original_name',
            type: 'text',
            value: media.original_name
          },
          {
            key: 'master_image_id',
            type: 'text',
            value: media.bucket
          },
          {
            key: 'master_image',
            type: 'text',
            value: media.imgix_url
          },
          {
            name: 'Optimized Images',
            key: 'optimized_images',
            type: 'repeater',
            "repeater_fields": [
              {
                title: 'Name',
                key: 'name',
                type: 'text',
              },
              {
                title: 'URL',
                key: 'url',
                type: 'text',
              }
            ],
            children: [
              {
                type: 'repeating_item',
                children: [
                  {
                    title: 'Name',
                    key: 'name',
                    value: `${payload.name || media.original_name}`,
                    type: 'text',
                  },
                  {
                    title: 'URL',
                    key: 'url',
                    value: `${media.imgix_url}?${payload.params}`,
                    type: 'text',
                  },
                ]
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
      const optimized_images = [];
      editImage.metadata.optimized_images.forEach(element => {
        optimized_images.push({
          type: 'repeating_item',
          children: [
            {
              title: 'Name',
              key: 'name',
              value: element.name,
              type: 'text',
            },
            {
              title: 'URL',
              key: 'url',
              value: element.url,
              type: 'text',
            },
          ]
        })
      });
      optimized_images.unshift({
        type: 'repeating_item',
        children: [
          {
            title: 'Name',
            key: 'name',
            value: `${payload.name || media.original_name}`,
            type: 'text',
          },
          {
            title: 'URL',
            key: 'url',
            value: `${media.imgix_url}?${payload.params}`,
            type: 'text',
          },
        ]
      });

      const editObject = {
        slug: editImage.slug,
        metafields: [
          {
            key: 'original_name',
            type: 'text',
            value: editImage.metadata.original_name
          },
          {
            key: 'master_image_id',
            type: 'text',
            value: editImage.metadata.master_image_id
          },
          {
            key: 'master_image',
            type: 'text',
            value: editImage.metadata.master_image
          },
          {
            name: 'Optimized Images',
            key: 'optimized_images',
            type: 'repeater',
            "repeater_fields": [
              {
                title: 'Name',
                key: 'name',
                type: 'text',
              },
              {
                title: 'URL',
                key: 'url',
                type: 'text',
              }
            ],
            children: optimized_images
          }
        ],
      };

      const { object: image } = await bucket.editObject(editObject);

      commit('EDIT_IMAGE_OBJECT', {
        id: state.editorModal.editIndex,
        optimized_image: {
          name: `${payload.name || media.original_name}`,
          url: `${media.imgix_url}?${payload.params}`,
        }
      });
      commit('CLOSE_IMAGE_EDITOR');

    } catch(e) {
    }
  }
}

export default actions
