const mutations = {
  SET_COSMIC_SETTINGS: (state, cosmic) => {
    state.settings = {
      ...state.settings,
      cosmic
    }
  },
  SET_IMAGES: (state, images) => {
    state.images = images;
  },
  ADD_IMAGE: (state, image) => {
    state.images.unshift(image);
  },
  SET_PROGRESS: (state, payload) => {
    state.progress = payload
  },
  SET_LOADING: (state, payload) => {
    state.loading = payload
  },
  SET_HELP_MODAL: (state, payload) => {
    state.modal = {
      help: payload
    }
  }
}

export default mutations
