<template lang="html">
  <div class="main">
    <div id="searchBox" class="jumbotron-fluid container">
      <div class="row">
        <p id="description" class="text-monospace">Enter the Github handle of the person you would like to access!</p>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">Github Username</span>
          </div>
          <input id="username" type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <button class="btn btn-outline-dark btn-lg"  type="button" name="submitButton" v-on:click="fetchData()">Seek</button>
      </div>
    </div>
    <br/><br/>
    <transition name="fade">
      <div class="showBox container" v-if="showBox == true">
        <div class="singleRepo" v-for="(repo, index) in repos">
          <div class="left-item" v-if="index%2 == 0">
            <br/>
            <div class="float-left">
              {{ repo }}
            </div>
            <!-- <br/> -->
          </div>
          <div class="right-item" v-else>
            <!-- <br/> -->
            <div class="float-right">
              {{ repo }}
            </div>
            <br/>
          </div>
        </div>
      </div>
    </transition>
    <br/>
  </div>
</template>

<script>

export default {
  data() {
    return {
      username: '',
      repos: [],
      showBox: false,
    }
  },
  methods: {
    fetchData() {
      let user = document.getElementById('username').value;
      this.$http.get('https://api.github.com/users/' + user + '/repos?access_token=41dcfe4e01aa577b5b6c282707acc0d2b5b1f961&per_page=50')
      .then(response => {
        let tempRepos = JSON.parse(JSON.stringify(response.body));
        for(let i = 0; i < tempRepos.length; i++) {
          // this.repos.push(tempRepos[i].name);
          let currentRepo = tempRepos[i].name;
          // this.repos.push(currentRepo);
          this.$http.get('https://api.github.com/repos/'+ user + '/'
          + currentRepo + '/languages?access_token=41dcfe4e01aa577b5b6c282707acc0d2b5b1f961')
          .then(response => {
            this.repos.push(currentRepo);
            this.repos.push(JSON.parse(JSON.stringify(response.body)));
          })
          .catch(response => alert(response.status));
        }
      })
      .catch(() => alert("Error"));
      this.showBox = true;
    }
  }
}
</script>

<style lang="css">
#description {
  font-size: 20px;
}

#searchBox {
  margin-top: 50px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.left-item {
  margin-left: 10px;
  margin-right: 10px;
}

.right-item {
  margin-left: 10px;
  margin-right: 10px;

}

.showBox {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 20px;
}
</style>
