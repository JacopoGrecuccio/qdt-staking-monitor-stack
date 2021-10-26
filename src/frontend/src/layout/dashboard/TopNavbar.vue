<template>
  <nav class="navbar navbar-light navbar-expand-lg py-0 navbar-shadow"
       :class="{'bg-dark': showMenu, 'navbar-transparent': !showMenu}">
    <div class="container">
          <div class="navbar-wrapper">
            <a class="navbar-brand" href="http://quadrans.io" target="_blank">
                <img src="img/logo_quadrans_color.svg" width="180">
            </a>
          </div>
          <button class="navbar-toggler" type="button"
                  @click="toggleMenu"
                  data-toggle="collapse"
                  data-target="#navigation"
                  aria-controls="navigation-index"
                  aria-label="Toggle navigation">
            <span class="navbar-toggler-bar navbar-kebab"></span>
            <span class="navbar-toggler-bar navbar-kebab"></span>
            <span class="navbar-toggler-bar navbar-kebab"></span>
          </button>

          <collapse-transition>
            <div class="collapse navbar-collapse show" v-show="showMenu">
              <ul class="navbar-nav">
                  <li class="nav-item">
                    <router-link class="nav-link" :to="{path: '/dashboard'}">Dashboard</router-link>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="http://staking.quadrans.io" target="_blank">QDT Staking Program</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" target="_blank">Token Contract</a>
                  </li>
                  <li>
                    <a class="nav-link" href="#" target="_blank">Staking Contract</a>
                  </li>
              </ul>
            </div>
          </collapse-transition>
        </div>
  </nav>
</template>
<script>
  import { CollapseTransition } from 'vue2-transitions';
  import Modal from '@/components/Modal';
  import router from '@/router/index';

  export default {
    components: {
      CollapseTransition,
      Modal
    },
    computed: {
      routeName() {
        const { name } = this.$route;
        return this.capitalizeFirstLetter(name);
      },
      isRTL() {
        return this.$rtl.isRTL;
      }
    },
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        searchModalVisible: false,
        searchQuery: ''
      };
    },
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications;
      },
      closeDropDown() {
        this.activeNotifications = false;
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      }
    }
  };
</script>
<style>
</style>
