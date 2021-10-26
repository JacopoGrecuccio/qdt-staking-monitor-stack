<template>
  <footer>
    <div id="footerMiddle" class="pt-4 d-print-none">
      <div class="container-fluid" style="overflow: hidden;">
        <div class="row">
          <div class="col-12 my-1 col-xl-6">
            <div class="row">
              <div class="col-12 col-lg-5 col-xl-4 mb-3  text-center text-lg-left">
                <img src="img/logo.svg" alt="Quadrans Foundation" height="43">
              </div>
              <div class="col-12 col-lg-7 col-xl-8 mb-3 text-center">
                  <a
                  href="https://www.linkedin.com/company/quadrans-foundation/"
                  title="LinkedIn" target="_blank">
                    <div class="circle-violet inline-block text-center">
                      <i class="fab fa-linkedin-in" aria-hidden="true"></i>
                    </div>
                  </a>
                  <a href="https://www.facebook.com/quadransfoundation/" title="Facebook" target="_blank">
                    <div class="circle-violet inline-block text-center">
                      <i class="fab fa-facebook-f" aria-hidden="true"></i>
                    </div>
                  </a>
                  <a href="https://twitter.com/QuadransF" title="Twitter" target="_blank">
                    <div class="circle-violet inline-block text-center">
                      <i class="fab fa-twitter" aria-hidden="true"></i>
                    </div>
                  </a>
                  <a href="https://t.me/quadrans" title="Telegram" target="_blank">
                    <div class="circle-violet inline-block text-center">
                      <i class="fab fa-telegram-plane" aria-hidden="true"></i>
                    </div>
                  </a>
                  <br class="d-none d-lg-block">
                  <a href="https://github.com/quadrans/" title="GitHub" target="_blank">
                    <div class="circle-violet inline-block text-center">
                      <i class="fab fa-github" aria-hidden="true"></i>
                    </div>
                  </a>
                  <a href="https://reddit.com/r/quadrans" title="Reddit" target="_blank">
                    <div class="circle-violet inline-block text-center">
                      <i class="fab fa-reddit-alien" aria-hidden="true"></i>
                    </div>
                  </a>
                  <a href="https://bit.ly/q-discord" title="Discord" target="_blank">
                    <div class="circle-violet inline-block text-center">
                      <i class="fab fa-discord" aria-hidden="true"></i>
                    </div>
                  </a>
                  <a href="https://instagram.com/quadrans_foundation" title="Instagram" target="_blank">
                    <div class="circle-violet inline-block text-center">
                      <i class="fab fa-instagram" aria-hidden="true"></i>
                    </div>
                  </a>
            </div>
          </div>
        </div>
        <div class="col-12 my-1 col-xl-6">
          <div class="row">
            <div class="col-12 col-sm-4 text-center">
              <p class="text-light"><a href="/ecosystem.php" class="active">Ecosystem</a></p>
              <p class="text-light"><a href="/foundation.php">Foundation</a></p>
              <p class="text-light"><a href="/members.php">Members</a></p>
              <p class="text-light"><a href="/news.php">News</a></p>
            </div>
            <div class="col-12 col-sm-4 text-center">
              <p class="text-light"><a href="https://explorer.quadrans.io" target="_blank">Mainnet Explorer</a></p>
              <p class="text-light"><a href="https://status.quadrans.io" target="_blank">Mainnet Status</a></p>
              <p class="text-light"><a href="/documentation.php">Documentation</a></p>
              <p class="text-light"><a href="https://notarize.quadrans.io" target="_blank">Timestamping</a></p>
            </div>
            <div class="col-12 col-sm-4 text-center">
              <p class="text-light"><a href="/mining.php">Mining</a></p>
              <p class="text-light"><a href="/donations.php">Donations</a></p>
              <p class="text-light"><a href="/contacts.php">Contacts</a></p>
              <p class="text-light"><a href="/privacy-policy.php">Privacy Policy</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="footerBottom">
    <div class="container-fluid" style="overflow: hidden; padding:10px">
      <div class="row">
        <div class="col">
          <p class="text-center"><small class="text-light">Copyright © 2018-2021 <b>Quadrans</b> | Via alla Torre n.2, 6850 Mendrisio – Switzerland | CHE 432.155.979 | e-mail: <a>fondazione@quadrans.io</a></small></p>
        </div>
      </div>
    </div>
  </div>
</footer>
  <!--
  <footer class="footer">
    <div class="container-fluid">
      <ul class="nav">
        <li class="nav-item">
          <a class="nav-link" href="https://quadrans.io">
            Quadrans Foundation
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="https://staking.quadrans.io">
            QDT Staking Program
          </a>
        </li>
      </ul>
      <div class="copyright">
        © {{2021}} Quadrans Foundation
      </div>
    </div>
  </footer>-->
</template>
<script>
  export default {
    data() {
      return {
        year: new Date().getFullYear()
      }
    }
  };
</script>
<style>
</style>
