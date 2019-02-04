<template>
  <b-modal
    :active="isModal"
    :width="640"
    scroll="keep"
    @close="closeModal">
    <div class="box">
      <div class="content">
        <h3 class="title is-4">Learn More</h3>
<<<<<<< HEAD
        <p>Want to learn more about optimizing your images using Imgix? 
          <a
            href="https://www.imgix.com/"
            target="_blank"
          >
            Visit their website
          </a> and 
          <a 
            href="https://docs.imgix.com/setup"
            target="_blank"
          >
            browse the documentation
          </a>.
        </p>
=======
        <p>Want to learn more about optimizing your images using Imgix?
          <a
            href="https://www.imgix.com/"
            target="_blank">Visit their website</a> and
          <a
            href="https://docs.imgix.com/setup"
            target="_blank">browse the documentation</a>.</p>
>>>>>>> 2fe056a15b714b3eed069731e00264ab651bfe22
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'HelpModal',
  computed: {
    isModal() {
      return this.$store.state.modal.help;
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('SET_HELP_MODAL', false);
    }
  }
};
</script>

