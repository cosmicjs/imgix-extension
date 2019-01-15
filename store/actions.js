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
  }
}

export default actions
